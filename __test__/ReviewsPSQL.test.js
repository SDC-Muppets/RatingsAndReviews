const db = require('../server/ReviewsPSQL/reviews.js');

const mockReview = {
  "product": "4",
  "page": 0,
  "count": 5,
  "results": [
      {
          "review_id": 8,
          "rating": 4,
          "summary": "These pants are fine",
          "recommend": true,
          "response": null,
          "body": "I do like these pants",
          "date": "2020-09-07",
          "name": "shopaddict",
          "helpfulness": 2,
          "photos": []
      },
      {
          "review_id": 9,
          "rating": 5,
          "summary": "These pants are great!",
          "recommend": true,
          "response": null,
          "body": "I really like these pants. Best fit ever!",
          "date": "2020-12-30",
          "name": "figuringitout",
          "helpfulness": 2,
          "photos": [
              {
                  "id": 4,
                  "url": "https://images.unsplash.com/photo-1542574621-e088a4464f7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3028&q=80"
              },
              {
                  "id": 5,
                  "url": "https://images.unsplash.com/photo-1560294559-1774a164fb0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
              },
              {
                  "id": 6,
                  "url": "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
              }
          ]
      },
      {
          "review_id": 10,
          "rating": 2,
          "summary": "These pants are ok!",
          "recommend": false,
          "response": null,
          "body": "A little tight on the waist.",
          "date": "2020-06-23",
          "name": "bigbrother",
          "helpfulness": 2,
          "photos": [
              {
                  "id": 7,
                  "url": "https://images.unsplash.com/photo-1549812474-c3cbd9a42eb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
              },
              {
                  "id": 8,
                  "url": "https://images.unsplash.com/photo-1560829675-11dec1d78930?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80"
              },
              {
                  "id": 9,
                  "url": "https://images.unsplash.com/photo-1559709319-3ae960cda614?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
              }
          ]
      }
  ]
};

describe('Queries for ratings and reviews', () => {
  it('GET /reviews for product_id = 4', async () => {
    let reviewData;
    await db.getReviews(4)
    .then((data) => {
      reviewData = {
        product: 4,
        page: 0,
        count: 5,
        results: data.rows
      }
    })
    .catch((err) => {
      reviewData = err;
    })
    expect(typeof reviewData).toBe('object');
    expect(reviewData.results[0][review_id]).toBe(8);
    });

  it('GET /meta for product_id = 4', async () => {
    let metaData;
    await db.getMeta(4)
    .then((data) => {
      metaData = data.rows[0]['json_build_object'];
    })
    .catch((err) => {
      metaData = err;
    })
    expect(typeof metaData).toBe('object');
    expect(metaData.product_id).toBe(4);
  });
});