declare -A packageDeps=(
  ["connector/processors/actionRequests/fromUserApiToQueue"]="connector/common connector/processors/actionRequests/fromUserApiToQueue"
  ["connector/tcpInterface"]="connector/common connector/tcpInterface"
  ["connector/userApi"]="connector/common connector/userApi"
  ["connector/common"]="connector/common"
  ["simulator"]="simulator"
  ["modules/protocols/theSimpleProtocol"]="modules/protocols/common modules/protocols/theSimpleProtocol"
)
