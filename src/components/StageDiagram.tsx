import { Stage, Line, Layer } from "react-konva";
import { useState, useEffect } from "react";
import Dancer from "./Dancer";
import { useTool } from "../contexts/ToolContext";
import { createDancer } from "./Dancer";
import type { DancerProps } from "./Dancer";

interface GridProps {
  cellSize?: number;
  width: number;
  height: number;
}

const StageGrid = ({ cellSize = 50, width, height }: GridProps) => {
  const verticalLines: number[] = [];
  const horizontalLines: number[] = [];

  //vertical lines
  //what is being pushed is a line from one point to the next
  //first two params are start point, next two are end point
  for (let x = 0; x <= width; x += cellSize) {
    verticalLines.push(x);
  }

  //horizontal lines
  for (let y = 0; y <= height; y += cellSize) {
    horizontalLines.push(y);
  }

  return (
    <>
      {verticalLines.map((x) => (
        <Line points={[x, 0, x, height]} stroke="white" strokeWidth={1} />
      ))}

      {horizontalLines.map((y) => (
        <Line points={[0, y, width, y]} stroke="white" strokeWidth={1} />
      ))}
    </>
  );
};

interface stageDiagramProps {
  projectId: string
}

const StageDiagram = ({projectId}: stageDiagramProps) => {
  const [dancers, setDancers] = useState<DancerProps[]>([]);
  const [preview, setPreview] = useState<DancerProps | null>(null);
  const [movingDancer, setMovingDancer] = useState<DancerProps | null>(null);
  const [rotatingDancer, setRotatingDancer] = useState<DancerProps | null>(
    null
  );
  const [originalRotation, setOriginalRotation] = useState<number | undefined>(
    undefined
  );

  const { selectedTool } = useTool();

  const cellSize = 25;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const snapToGrid = (pos: number) => Math.round(pos / cellSize) * cellSize;

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (pointer) {
      setPreview(createDancer(snapToGrid(pointer.x), snapToGrid(pointer.y)));
    }

    if (rotatingDancer) {
      const dx = pointer.x - rotatingDancer.x;
      const dy = pointer.y - rotatingDancer.y;

      let getRotationAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      getRotationAngle += 90;
      if (getRotationAngle < 0) {
        getRotationAngle += 360;
      }
      getRotationAngle = Math.round(getRotationAngle / 45) * 45;

      setDancers((prevDancers) =>
        prevDancers.map((dancer) =>
          dancer.id === rotatingDancer.id
            ? { ...dancer, rotation: getRotationAngle }
            : dancer
        )
      );
    }
  };

  const handleClick = () => {
    console.log("stage clicked");

    //first portion of moving/rotating dancer functionality
    if (preview && (selectedTool === "move" || selectedTool === "rotate")) {
      const targetDancer = dancers.find(
        (dancer) => dancer.x === preview.x && dancer.y === preview.y
      );

      if (targetDancer && selectedTool === "move") {
        setMovingDancer(targetDancer);
        setOriginalRotation(targetDancer.rotation);

        setDancers((prevDancers) =>
          prevDancers.filter(
            (dancer) => !(dancer.x === preview.x && dancer.y === preview.y)
          )
        );
      }

      if (targetDancer && selectedTool === "rotate") {
        if (targetDancer) {
          setRotatingDancer(targetDancer);
          setOriginalRotation(targetDancer.rotation);

          setDancers((prevDancers) =>
            prevDancers.map((dancer) =>
              dancer.id === targetDancer.id
                ? { ...dancer, isPreview: true }
                : dancer
            )
          );
        }
      }
    }

    //second portion of moving dancer functionality
    if (movingDancer && preview) {
      setDancers([
        ...dancers,
        createDancer(preview.x, preview.y, originalRotation),
      ]);
      setMovingDancer(null);
      setPreview(null);
    }

    //second portion of rotating dancer functionality
    if (rotatingDancer && preview) {
      setDancers((prevDancers) =>
        prevDancers.map((dancer) =>
          dancer.id === rotatingDancer.id
            ? { ...dancer, isPreview: false }
            : dancer
        )
      );

      setRotatingDancer(null);
      setPreview(null);
    }

    if (preview && selectedTool === "delete") {
      setDancers((prevDancers) =>
        prevDancers.filter(
          (dancer) => !(dancer.x === preview.x && dancer.y === preview.y)
        )
      );
    }

    if (preview && selectedTool === "create") {
      const exists = dancers.some(
        (dancer) => dancer.x === preview.x && dancer.y === preview.y
      );

      if (exists) {
        console.log("helo");
        return;
      }

      setDancers([...dancers, createDancer(preview.x, preview.y)]);
      setPreview(null);
    }
  };

  // useEffect hook listens to whether the tool selected is changed during
  // a dancer move, and replaces original dancer if process is interrupted
  useEffect(() => {
    if (movingDancer) {
      setDancers([
        ...dancers,
        createDancer(movingDancer.x, movingDancer.y, originalRotation),
      ]);

      setMovingDancer(null);
      setOriginalRotation(undefined);
      setPreview(null);
    }

    if (rotatingDancer && originalRotation !== null) {
      setDancers((prevDancers) =>
        prevDancers.map((dancer) =>
          dancer.id === rotatingDancer.id
            ? { ...dancer, isPreview: false, rotation: originalRotation }
            : dancer
        )
      );

      setRotatingDancer(null);
      setOriginalRotation(undefined);
    }
  }, [selectedTool]);

  return (
    <Stage
      width={width}
      height={height}
      style={{
        background: "gray",
        cursor:
          selectedTool === "create"
            ? "default"
            : selectedTool === "delete"
            ? "not-allowed"
            : selectedTool === "move"
            ? "move"
            : "grab",
      }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <Layer>
        <StageGrid cellSize={cellSize} width={width} height={height} />

        {dancers.map((dancer) => (
          <Dancer key={dancer.id} {...dancer} />
        ))}

        {selectedTool === "create" && preview && (
          <Dancer {...preview} isPreview />
        )}

        {movingDancer && selectedTool === "move" && preview && (
          <Dancer {...preview} rotation={originalRotation} isPreview />
        )}
      </Layer>
    </Stage>
  );
};

export default StageDiagram;
