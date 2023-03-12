import axios from "axios";
import { useEffect, useState } from "react";
import { PlanetType, SelectedType, VehicleType } from "../../types/types";
import { Button } from "../Button/Button";

export const Planets = () => {
  const [planetsData, setPlanetsData] = useState<PlanetType[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<
    Record<number, SelectedType>
  >({});
  const [availableVehicles, setAvailableVehicles] = useState<VehicleType[]>([]);
  const [filteredVehicle, setFilteredVehicle] = useState<VehicleType[]>([]);
  const [isVisited, setIsVisited] = useState<Record<string, boolean>>({});
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);

  useEffect(() => {
    fetchPlanets();
    getVehicle();
  }, []);

  async function fetchPlanets() {
    const planets = await axios.get(
      "https://findfalcone.geektrust.com/planets"
    );
    setPlanetsData(planets?.data);
  }

  async function getVehicle() {
    const vehicles = await axios.get(
      "https://findfalcone.geektrust.com/vehicles"
    );
    setAvailableVehicles(vehicles?.data);
  }

  async function changeHandler(planet: string, index: number) {
    const updateSelectedPlanet = { ...selectedPlanet };
    const updatedVistedPlanet = { ...isVisited };

    const alreadySelectedPlanet = updateSelectedPlanet[index]?.name;
    if (alreadySelectedPlanet) {
      delete updatedVistedPlanet[alreadySelectedPlanet];
    }
    updateSelectedPlanet[index] = { name: planet };
    updatedVistedPlanet[planet] = true;

    setIsVisited(updatedVistedPlanet);
    setSelectedPlanet(updateSelectedPlanet);
    setActiveIndex(index);
    const fetchPlanetData = planetsData.find((data) => data.name === planet);
    if (fetchPlanetData) {
      const selectedVehicles = availableVehicles.filter(
        (vehicle) =>
          vehicle.max_distance >= fetchPlanetData?.distance &&
          vehicle.total_no > 0
      );
      setFilteredVehicle(selectedVehicles);
    }
  }

  function vehicleHandler(vehicleName: string) {
    const updateSelectedPlanet = { ...selectedPlanet };
    const updateVehicle = [...availableVehicles];
    const planetInfo = planetsData?.find(
      (planet) => planet?.name === updateSelectedPlanet[activeIndex]?.name
    );

    if (updateSelectedPlanet[activeIndex].vehicle) {
      const alreadyExistsVehicle = updateSelectedPlanet[activeIndex].vehicle;
      const vehicleIndex = updateVehicle.findIndex(
        (vehicle) => vehicle.name === alreadyExistsVehicle
      );
      updateVehicle[vehicleIndex].total_no++;
      planetInfo &&
        setTimeTaken(
          (prev) =>
            prev -
            Math.floor(
              planetInfo?.distance / updateVehicle[vehicleIndex]?.speed
            )
        );
    }
    updateSelectedPlanet[activeIndex].vehicle = vehicleName;
    setSelectedPlanet(updateSelectedPlanet);

    const vehicleIndex = updateVehicle.findIndex(
      (vehicle) => vehicle.name === vehicleName
    );
    updateVehicle[vehicleIndex].total_no > 0 &&
      updateVehicle[vehicleIndex].total_no--;

    setAvailableVehicles(updateVehicle);
    planetInfo &&
      setTimeTaken(
        (prev) =>
          prev +
          Math.floor(planetInfo?.distance / updateVehicle[vehicleIndex]?.speed)
      );
  }

  async function clickHandler() {
    const token = await axios.post("https://findfalcone.herokuapp.com/token");
    console.log("token", token);
  }

  return (
    <div>
      <h2> Select Planets</h2>
      <div>
        {[...Array(4)].map((_, index) => {
          return (
            <>
              <select
                key={index}
                value={selectedPlanet[index]?.name}
                onChange={(event) => changeHandler(event.target.value, index)}
              >
                <option>Choose Planet</option>
                {!!planetsData?.length &&
                  planetsData.map((planet, index) => {
                    return (
                      <option
                        disabled={isVisited[planet.name]}
                        key={index}
                        value={planet?.name}
                      >
                        {planet?.name}
                      </option>
                    );
                  })}
              </select>
              <div
                className="__vehicle"
                onChange={(event: any) => vehicleHandler(event.target.value)}
              >
                {!!filteredVehicle?.length &&
                  !!Object.keys(isVisited).length &&
                  index === activeIndex &&
                  filteredVehicle.map((vehicle, index) => (
                    <div key={index}>
                      <input
                        id={`${index}`}
                        type="radio"
                        name="vehicle"
                        value={vehicle?.name}
                      />
                      {vehicle?.name} ({vehicle?.total_no})
                    </div>
                  ))}
              </div>
            </>
          );
        })}
      </div>
      <div>
        Time Taken : <span>{timeTaken}</span>
      </div>
      <div>
        <Button title="Finding Falcon" callbackOnClick={clickHandler} />
      </div>
    </div>
  );
};
