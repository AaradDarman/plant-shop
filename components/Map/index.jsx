import { useContext, memo, useRef } from "react";

import NeshanMap from "react-neshan-map-leaflet";
import styled from "styled-components";

import SearchInput from "./SearchInput";
import { mapContext } from "context/map-context";

const StyledWraper = styled.div`
  position: relative;
  flex: 1;
  height: 368px;
  margin: 15px 0;
`;

const Map = ({ onInputClick }) => {
  const {
    mapCenter,
    setMapCenter,
    setMap,
    map,
    handleChangeView,
    handleChangeSearch,
    searchTerm,
    searchResults,
  } = useContext(mapContext);

  function useFirstRender() {
    const ref = useRef(true);
    const firstRender = ref.current;
    ref.current = false;
    return firstRender;
  }

  const firstRender = useFirstRender();

  return (
    <StyledWraper>
      <SearchInput
        handleChangeSearch={handleChangeSearch}
        searchTerm={searchTerm}
        searchResults={searchResults}
        onResultClick={handleChangeView}
        onInputClick={onInputClick}
      />
      <NeshanMap
        options={{
          key: "web.5c4f334ea96d4c4e95bd08f534d39818",
          maptype: "dreamy",
          poi: true,
          traffic: false,
          center: mapCenter,
          zoom: 17,
        }}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
        onInit={(L, myMap) => {
          if (firstRender && _.isEqual(mapCenter, [28.946301, 53.647447])) {
            myMap.locate({ setView: true, maxZoom: 17 });
          }
          setMap(myMap);
          myMap.setMapType("standard-day");
          myMap.zoomControl.setPosition("bottomright");
          myMap.on("moveend", () => {
            setMapCenter([myMap.getCenter().lat, myMap.getCenter().lng]);
          });
        }}
      />
      <div id="center-marker"></div>
    </StyledWraper>
  );
};

export default memo(Map);
