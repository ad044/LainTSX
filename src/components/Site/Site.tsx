import React, { memo, Suspense, useMemo } from "react";
import site_a from "../../resources/site_a.json";
import Level from "../Level";
import level_y_values from "../../resources/level_y_values.json";
import Column from "../Column";
import columns from "../../resources/columns.json";

type ColumnsJsonData = {
  [id: string]: string[];
};

const Site = memo(() => {
  const siteData = useMemo(
    () => ({
      columnJson: columns as ColumnsJsonData,
      siteA: Object.entries(site_a),
    }),
    []
  );

  return (
    <>
      <Suspense fallback={<>loading...</>}>
        {/* distance between LEVELS is 1.5 */}
        {/*{Object.values(level_y_values).map((yVal) => {*/}
        {/*  return <Level levelPosY={yVal} key={yVal} />;*/}
        {/*})}*/}

        {/*{Array.from(Array(8).keys()).map((colIdx: number) => {*/}
        {/*  return (*/}
        {/*    <Column*/}
        {/*      columnData={siteData.siteA.filter((blueOrb) =>*/}
        {/*        siteData.columnJson[colIdx].includes(blueOrb[0].substr(2))*/}
        {/*      )}*/}
        {/*      key={colIdx}*/}
        {/*    />*/}
        {/*  );*/}
        {/*})}*/}
      </Suspense>
    </>
  );
});

export default Site;
