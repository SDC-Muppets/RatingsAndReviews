import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  const body = JSON.stringify({
    "product_id": "111111",
    "rating": "3",
    "summary": "Twas an excellent piece of armor for my body.",
    "body": "Tis armor doth glisten in the sun and blinds mine enemies.",
    "recommend": "true",
    "name": "SirDooby",
    "email": "sirdooby@gmail.com",
    "photos": ["https://www.darksword-armory.com/wp-content/uploads/2019/10/jousting-armor-1-scaled.jpg"],
    "characteristics": {
        "100": "1",
        "101": "2",
        "102": "3",
        "103": "4",
        "104": "5",
        "105": "4"
    }
  });
  http.post('http://localhost:3000/reviews?product', body);
  sleep(1);
};


