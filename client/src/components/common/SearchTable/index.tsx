import React, { useState, useRef, useEffect } from "react";

import { Button, Table } from "..";

import {
  SearchContainer,
  SearchHeader,
  H3,
  Input,
  HiddenLabel,
  PageInfo,
} from "./styles";

const PAGE_SIZE = 5;

type SearchTableProps<T extends string[]> = {
  title: string;
  data: { [key: string]: any }[];
  tableProps: {
    titles: [...T];
    widths: [...{ [I in keyof T]: number }];
  };
  labelPath: string[];
  results: (arg0: any) => React.ReactNode;
};

export const SearchTable = <T extends string[]>({
  title,
  data,
  tableProps,
  results,
  labelPath,
}: SearchTableProps<T>) => {
  const [searchResults, setSearchResults] = useState(data);
  const [slicedResults, setSlicedResults] = useState(searchResults);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(searchResults.length / PAGE_SIZE)
  );
  const [displayString, setDisplayString] = useState("");

  const term = useRef("");

  useEffect(() => {
    setSearchResults(data);
  }, [data]);

  useEffect(() => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const sliced = searchResults.slice(start, end);

    const totalLength = searchResults.length;

    let resultsLength = "";

    if (totalLength <= PAGE_SIZE) {
      resultsLength = `${sliced.length}`;
    } else if (totalLength <= end) {
      resultsLength = `${totalLength}`;
    } else {
      resultsLength = `${totalLength !== 0 ? start + 1 : 0}`;
    }

    const pageLength = end < totalLength ? `-${end}` : "";
    const forTerm = term.current ? `for "${term.current}"` : "";

    setSlicedResults(sliced);
    setDisplayString(
      `displaying ${resultsLength}${pageLength} of ${totalLength} results ${forTerm}`
    );
    setTotalPages(Math.ceil(searchResults.length / PAGE_SIZE));
  }, [searchResults, page]);

  const getDynamicLabels = (paths: string[], data: { [key: string]: any }) => {
    const labels = [];

    for (let i = 0; i < paths.length; i++) {
      let label = paths[i]
        .split(".")
        .reduce((obj, key) => (obj && obj[key]) || null, data);

      if (label) labels.push(label.toUpperCase());
    }

    return labels;
  };

  const executeSearch = (keyword: string) => {
    term.current = keyword;

    if (!keyword) {
      setSearchResults(data);
      return;
    }

    const results = data.filter((result) => {
      const labels = getDynamicLabels(labelPath, result);

      return labels?.find((label) =>
        label.includes(term.current.toUpperCase())
      );
    });

    setSearchResults(results);
    setPage(0);
  };

  const { titles, widths } = tableProps;

  return (
    <SearchContainer>
      <SearchHeader>
        <H3>{title}</H3>
        <HiddenLabel htmlFor="search-input" />
        <Input
          name="search-input"
          placeholder="Enter keyword here"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            executeSearch(e.target.value)
          }
          value={term.current}
        />
      </SearchHeader>
      {data?.length ? (
        searchResults.length ? (
          <Table titles={titles} widths={widths}>
            {slicedResults.map((item) => results(item))}
          </Table>
        ) : (
          <p>No results found.</p>
        )
      ) : (
        <p>No data to be shown.</p>
      )}
      {totalPages > 1 && (
        <>
          <PageInfo>
            <p>
              Page {page + 1} of {totalPages}
            </p>
            <p>{displayString}</p>
          </PageInfo>
          <Button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page - 1 < 0}
          >
            Previous
          </Button>
          <Button
            type="secondary"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages - 1}
          >
            Next
          </Button>
        </>
      )}
    </SearchContainer>
  );
};
