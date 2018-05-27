"use strict";

const rqrs  = require('request-promise'),
      cheerio = require('cheerio')

module.exports = async id => {
  // const url =
  //   `${id}?fields=cover,description,start_time,end_time,event_times,name,place,timezone`
  // return await facebookFetch(url)
  const requested = await rqrs({
    url: `https://www.facebook.com/events/${id}/`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15'
    }
  })
  const $ = cheerio.load(requested.replace(/<code.*?><!--(.*)--><\/code>/g, "$1"))

  const dateTimeRegex = /(.*?)\sto\s.(.*?)/g
  const fetchedDateTime = $("._publicProdFeedInfo__timeRowTitle").attr("content")

  const $place = $("#event_summary ul > li:nth-of-type(2) table > tbody > tr > td:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div").html()

  return {
    cover: {
      source: $("#event_header_primary > div > a[ajaxify][data-ploi]").attr("data-ploi")
    },
    description: $("span[data-testid=\"event-permalink-details\"]").html(),
    start_time: fetchedDateTime.replace(dateTimeRegex, "$1"),
    end_time: fetchedDateTime.replace(dateTimeRegex, "$1"),
    name: $("h1[data-testid=\"event-permalink-event-name\"]").html(),
    place: {
      name: $place.find("span").html(),
      location: $place.find("div").html()
    }
  }
}
