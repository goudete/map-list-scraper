const axios = require('axios');

const API_KEY = '';


async function scrapePlaces(placeNamesAndTitles) {

  const places = [];
  for (const place of placeNamesAndTitles) {
    console.log(`[SCRAPING] ${place.name}, ${place.address}`)
    const placeId = await getPlaceId(`${place.name}, ${place.address}`);
    const placeDetails = await getPlaceDetails(placeId);
    places.push(placeDetails);
  }

  return places;
}

async function getPlaceId(place) {
  try {
    const encodedAddress = encodeURIComponent(place);
    const { data } = await axios(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodedAddress}&inputtype=textquery&key=${API_KEY}`
    );

    return data?.candidates[0]?.place_id;

  } catch (error) {
    console.log('Error Getting place ID: ', error);
  }
}

async function getPlaceDetails(placeId) {
  try {
    const { data } = await axios(
      `https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        place_id: placeId,
        fields: 'place_id,formatted_address,name,rating,website,editorial_summary,price_level,reviews,formatted_phone_number,business_status,url',
        key: API_KEY,
      }
    });

    return data?.result 
      ? transformPlaceDetails(data?.result) : [];

  } catch (error) {
    console.log('Error getting place details: ', error);
  }
}

function transformPlaceDetails(result) {
  return {
    placeId: result?.place_id,
    name: result?.name,
    description: result?.editorial_summary?.overview,
    rating: result?.rating,
    website: result?.website,
    googleUrl: result?.url,
    phoneNumber: result?.formatted_phone_number,
    address: result?.formatted_address,
    priceLevel: result?.price_level,
    businessStatus: result?.business_status,
    reviews: JSON.stringify(result?.reviews),
  };
}

module.exports = {
  scrapePlaces
}