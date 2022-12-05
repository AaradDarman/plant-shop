import React from "react";

import { rgba } from "polished";
import styled from "styled-components";

import useBreakpoints from "utils/useBreakPoints";

const StyledWraper = styled.div`
  width: 100%;
  padding: 0 2rem;
  max-height: calc(100% - 10px);
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`;

const StyledInputWraper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => rgba(theme.palette.text.primary, 0.23)};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => rgba(theme.palette.text.primary, 0.23)};
  padding: 10px 0;
  padding-right: 4px;
`;

const StyledInput = styled.input`
  all: unset;
  padding: 2px 4px;
  color: ${({ theme }) => theme.palette.text.primary};
  ::placeholder {
    font-size: 14px;
  }
`;

const StyledSearchResult = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  padding: 5px;
  max-height: 50%;
  overflow-y: scroll;
  .result-item {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid
      ${({ theme }) => rgba(theme.palette.text.primary, 0.23)};
    padding: 5px;
    cursor: default;
  }
`;

const SearchInput = ({
  handleChangeSearch,
  searchTerm,
  searchResults,
  onResultClick,
  onInputClick,
}) => {
  const { isLg } = useBreakpoints();
  return (
    <StyledWraper>
      <StyledInputWraper>
        <StyledInput
          type="text"
          onChange={handleChangeSearch}
          onClick={() => {
            !isLg && onInputClick();
          }}
          value={searchTerm}
          placeholder="جستجوی آدرس"
        />
      </StyledInputWraper>
      {searchResults.length > 0 && (
        <StyledSearchResult>
          {searchResults.map((item) => (
            <div
              key={JSON.stringify(item.location)}
              className="result-item"
              onClick={() => onResultClick(item)}
            >
              <span className="d-flex">{item.title}</span>
              <span className="d-flex">{item.address}</span>
            </div>
          ))}
        </StyledSearchResult>
      )}
    </StyledWraper>
  );
};

export default SearchInput;
