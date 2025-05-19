import ContextLoader from "../context/ContextLoader.ts";
import ContextInterface from "../context/ContextInterface.ts";

const contextLoader = new ContextLoader();

const context: ContextInterface = contextLoader.public();

export default context;
