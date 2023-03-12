export type PlanetType = {
  name: string;
  distance: number;
};

export type VehicleType = {
  max_distance: number;
  name: string;
  speed: number;
  total_no: number;
};

export type SelectedType = {
  name?: string;
  vehicle?: string;
};
