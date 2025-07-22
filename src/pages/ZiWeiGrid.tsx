// pages/ZiWeiGrid.tsx

import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import "./ZiWeiGrid.css";
import { getZiweiPalaces } from "../utils/ziwei";
import { convertToLunar } from '../utils/lunarConverter';

import { Palace } from "../utils/palaces";
import { useParams } from "react-router-dom";
import { getUserByUid } from "../utils/userDb";
import { EARTHLY_BRANCHES } from "../utils/constants";

const gridMap: { [pos: number]: string } = {
  1: "pos-1",
  2: "pos-2",
  3: "pos-3",
  4: "pos-4",
  5: "pos-5",
  6: "pos-6",
  7: "pos-7",
  8: "pos-8",
  9: "pos-9",
  10: "pos-10",
  11: "pos-11",
  12: "pos-12",
};

const ZiWeiGrid: React.FC = () => {
  const { uid } = useParams();
  const [palaces, setPalaces] = useState<Palace[] | null>(null);
  const [mingIndex, setMingIndex] = useState<number | null>(null);
  const [ganzhi, setGanzhi] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    getUserByUid(uid).then((user) => {
      if (user?.birthDatetime && typeof user.birthLng === "number") {
        const { palaces, mingIndex } = getZiweiPalaces(user.birthDatetime, user.birthLng);

        setPalaces(palaces);
        setMingIndex(mingIndex);

        // 命宮干支
        const lunar = convertToLunar(new Date(user.birthDatetime), user.birthLng);
        setGanzhi(lunar.eightChar.getYear());
      }

      setLoading(false);
    });
  }, [uid]);

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /></div>;
  }

  if (!palaces) {
    return <div className="text-danger">找不到使用者資料</div>;
  }

  return (
    <div className="ziwei-grid">
      {palaces.map(({ name, position, index }) => {
        const branch = EARTHLY_BRANCHES[(index - 1) % 12];
        const isMing = position === mingIndex;
        return (
          <div
            key={position}
            className={`grid-box ${gridMap[position]}`}
          >
            <Card className="text-center">
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <div style={{ fontSize: "80%" }}>{branch}宮</div>
                {isMing && (
                  <div style={{ fontSize: "80%", color: "red" }}>命宮（{ganzhi}）</div>
                )}
              </Card.Body>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default ZiWeiGrid;
