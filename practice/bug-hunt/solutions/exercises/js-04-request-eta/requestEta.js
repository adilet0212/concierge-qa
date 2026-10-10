// Estimated minutes until a guest request is fulfilled.
export function requestEtaMinutes(requestType) {
  let minutes;
  switch (requestType) {
    case 'towels':
      minutes = 10;
      break; // Fixed: without break, 'towels' fell through into 'pillows'.
    case 'pillows':
      minutes = 15;
      break;
    case 'in-room-dining':
      minutes = 35;
      break;
    case 'late-checkout':
      minutes = 0;
      break;
    default:
      minutes = 20;
  }
  return minutes;
}
