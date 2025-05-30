# Vehicle Connector
Use REST-API to connect to vehicles via TCP/HTTP. Only TCP is supported at the moment.

The Connector application consists of 4 services. For debugging and simulation a viewer and a simulation service are available.

## Setup
### Dependencies
```
npm run setupDependencies
```
### ActionRequests
- set env file
```
cp .env.example .env
```
- adjust INTERNAL, depending on public or internal repository usage

### FromTcpInterfaceMessages
- set env file
```
cp .env.example .env
```
- adjust INTERNAL, depending on public or internal repository usage

### TcpInterface
- default tcp port is 1234

### UserApi
- default http port is 3000

### Simulator
- set env file
```
cp .env.example .env
```
- adjust INTERNAL, depending on public or internal repository usage
- add Graphhopper API key so that routes can be calculated
- set config.json file
```
cp config.example.json config.json
```
- for each imei there needs to be a protocolsConfigs entry otherwise the script does not run

## Run
- start all services via npm run or use run configurations for Webstorm in infrastructure/idea/runScripts
- starting the simulator will lead to simulated movement, locking/unlocking of vehicles

## Process flows (WIP)
### Sending actions
#### request
action request -> userApi ->  action_requests (work queue) -> parser -> socket_requests (exchange) -> tcpInterface -> tcp request
#### response
tcp response -> socket_responses (exchange) -> parser -> action_response (exchange) -> userApi -> action response
### receiving vehicle updates
tcp request -> socket_requests (exchange) -> parser [save to db]
-> socket_requests (exchange) -> parser -> if action related -> action_responses (exchange) -> userApi -> action response
-> socket_requests (exchange) -> parser -> webhooks_outgoing (exchange) -> webhookDispatcher (1, x) -> http
