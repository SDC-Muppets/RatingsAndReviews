import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.put('http://localhost:3000/reviews/helpful?review_id=8');
  sleep(1);
};


