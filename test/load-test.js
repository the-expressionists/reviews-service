import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('error_rate');

export default function() {
  const rnd = Math.floor(Math.random() * 10000000) + 1;
  const response = http.get(`http://localhost:1337/api/reviews/${rnd}`);
  errorRate.add(response.status >= 400);
}

export let options = {
  scenarios: {
    ramping_request_rate: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 500,
      stages: [
        { target: 100, duration: '60s' },
        { target: 1000, duration: '60s' },
        { target: 10000, duration: '60s' }
      ]
    }
  }
}