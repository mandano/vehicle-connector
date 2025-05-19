# Vehicle Connector
Use REST-API to connect to vehicles via TCP/HTTP. Only TCP is supported for at the moment.

### Sending actions
#### request
action request -> userApi ->  action_requests (work queue) -> parser -> socket_requests (exchange) -> tcpInterface -> tcp request
#### response
tcp response -> socket_responses (exchange) -> parser -> action_response (exchange) -> userApi -> action response
### receiving vehicle updates
tcp request -> socket_requests (exchange) -> parser [save to db]
            -> socket_requests (exchange) -> parser -> if action related -> action_responses (exchange) -> userApi -> action response
            -> socket_requests (exchange) -> parser -> webhooks_outgoing (exchange) -> webhookDispatcher (1, x) -> http
