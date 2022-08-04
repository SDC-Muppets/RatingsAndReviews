import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.put('http://localhost:3000/reviews/report?review_id=8');
  sleep(1);
};


