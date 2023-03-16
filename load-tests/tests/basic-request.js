import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
  const res = http.get(__ENV.TEST_URL);

  // Verify response
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
