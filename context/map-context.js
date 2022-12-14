import { createContext } from "react";

export const mapContext = createContext({
  openAddAddressModal: () => {},
  closeAddAddressModal: () => {},
  openSelectAddressModal: () => {},
  closeSelectAddressModal: () => {},
  openDeleteAddressModal: () => {},
  closeDeleteAddressModal: () => {},
  searchTerm: "",
  setSearchTerm: () => {},
  handleChangeSearch: () => {},
  searchResults: [],
  setSearchResults: () => {},
  mapCenter: [],
  setMapCenter: () => {},
  handleChangeView: () => {},
  findAddress: () => {},
  map: null,
  setMap: () => {},
  postalAddress: "",
  setPostalAddress: () => {},
  city: "",
  setCity: () => {},
  addressState: "",
  setAddressState: () => {},
  states: [],
  cities: [],
  receiverFName: "",
  setReceiverFName: () => {},
  receiverLName: "",
  setReceiverLName: () => {},
  receiverPhone: "",
  setReceiverPhone: () => {},
  postalCode: "",
  setPostalCode: () => {},
  plaque: "",
  setPlaque: () => {},
});
