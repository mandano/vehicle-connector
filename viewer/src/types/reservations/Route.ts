import Waypoints from "../Waypoints";

type Route = {
  waypoints: Waypoints;
  distance: number;
  duration: number;
  avgSpeed: number;
};

export default Route;