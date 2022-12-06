# AgriDex Beckn

APIs of the safal platform in KONNECT stack.

Repository is a monorepo and has the following apps:

- Client-Proxy
  - This service helps convert the synchronous HTTP calls to async with the help of the redis pub-sub mechanism.
  - All the client requests and BAP responses are transferred from and to the client apps via this service.

- BAP
  - An implementation of the Beckn Application Platform.

- BG
  - An implement of the Beckn-Gateway

- BPP
  - An implementation of the Beckn Provider Platform

- A Mock Bank API 
  - A simple API that mocks the processing of a loan application at a bank for demonstration of the complete flow of loan fulfillment in the Konnect Stack.

## Steps to run the project

  1. Clone the project locally.
  2. Navigate the project directory
  3. Run `yarn` to install the dependencies
  4. Run `yarn start:all` to run all the services at once, or simply run `yarn {service_name}` (without the brackets) to run a specific service.
