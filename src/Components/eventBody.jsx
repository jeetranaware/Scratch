import * as React from "react";
import { SingleAction } from "./singleAction";
import { Droppable } from "react-beautiful-dnd";
import { Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Sprites } from "./spriteProps";
import Positions from "./positons";
import Draggable1 from "react-draggable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WARN_MSG_POS, WARN_MSG_SIZE } from "../constants";

export const EventBody = (props) => {
  const { moves, setMoves, actions, setActions, setActions2, actions2 } = props;

  const ref = React.useRef();
  const ref2 = React.useRef();

  let r = "0%";
  let t = "0%";
  let scale = 1;
  let angle = 0;
  let r2 = "0%";
  let t2 = "0%";
  let scale2 = 1;
  let angle2 = 0;

  const [hello, setHello] = React.useState(false);
  const [hello2, setHello2] = React.useState(false);
  const [theme] = React.useState(false);
  const [displayAddIcon, setDisplayAddIcon] = React.useState(true);
  const [sprite, setSprite] = React.useState(
    require("../Assets/images/cat.png")
  );
  const [sprite2, setSprite2] = React.useState(null);

  console.log("rendering...");
  function checkCollision() {
    // Check if both refs are defined
    if (ref.current && ref2.current) {
      const rect1 = ref.current.getBoundingClientRect();
      const rect2 = ref2.current.getBoundingClientRect();

      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    }
    return false; // Return false if either ref is undefined
  }

  function swapAnimations() {
    // Swap actions when characters collide
    const tempActions = [...actions];
    const tempActions2 = [...actions2];
    setActions(tempActions2);
    setActions2(tempActions);
  }

  function transform(temp, xAxis, action1) {
    let value = temp.toString();
    if (xAxis) {
      if (action1) {
        r = value.concat("%");
      } else {
        r2 = value.concat("%");
      }
    } else {
      if (action1) {
        t = value.concat("%");
      } else {
        t2 = value.concat("%");
      }
    }
    action1
      ? (ref.current.style.transform = `scale(${scale})translate(${r}, ${t}) rotate(${angle}deg)`)
      : (ref2.current.style.transform = `scale(${scale2})translate(${r2}, ${t2}) rotate(${angle2}deg)`);
  }

  function moveUp(i, action1) {
    //move up top - 50
    setTimeout(() => {
      let temp = parseInt(action1 ? t.slice(0, -1) : t2.slice(0, -1));
      temp = temp - 30;
      if (temp < -140) {
        refresh(WARN_MSG_POS);
        return;
      }
      transform(temp, false, action1);
      // Check for collision immediately after moving
      if (checkCollision()) {
        handleCollision(temp, action1);
        return; // Stop further actions if collision occurs
      }
    }, i * 1500);
  }
  function moveDown(i, action1) {
    //move down top + 50
    setTimeout(() => {
      let temp = parseInt(action1 ? t.slice(0, -1) : t2.slice(0, -1));
      temp = temp + 30;
      if (temp > 140) {
        refresh(WARN_MSG_POS);
        return;
      }
      transform(temp, false, action1);
      // Check for collision immediately after moving
      if (checkCollision()) {
        handleCollision(temp, action1);
        return;
      }
    }, i * 1500);
  }
  function moveRight(i, action1) {
    setTimeout(() => {
      let temp = parseInt(action1 ? r.slice(0, -1) : r2.slice(0, -1));
      temp = temp + 30;
      if (temp > 290) {
        refresh(WARN_MSG_POS);
        return;
      }
      transform(temp, true, action1);

      if (checkCollision()) {
        handleCollision(temp, action1);
        return;
      }
    }, i * 1500);
  }
  function moveLeft(i, action1) {
    setTimeout(() => {
      let temp = parseInt(action1 ? r.slice(0, -1) : r2.slice(0, -1));
      temp = temp - 30;
      if (temp < -290) {
        refresh(WARN_MSG_POS);
        return;
      }
      transform(temp, true, action1);
      if (checkCollision()) {
        handleCollision(temp, action1);
        return;
      }
    }, i * 1500);
  }
  function handleCollision(temp, action1) {
    const otherSprite = action1 ? ref2.current : ref.current;
    const otherPosition = parseInt(action1 ? r2.slice(0, -1) : r.slice(0, -1));
    const bounceBackDistance = 10;

    // Adjust positions for bounce-back
    if (action1) {
      transform(otherPosition - bounceBackDistance, true, false); // Move second sprite left
      transform(temp - bounceBackDistance, true, action1); // Move first sprite back right
    } else {
      transform(otherPosition + bounceBackDistance, true, true); // Move first sprite right
      transform(temp + bounceBackDistance, true, action1); // Move second sprite back left
    }

    // Continue actions after the collision
    swapAnimations(); // Swap actions on collision, then continue the loop
  }

  function moveXY(xInput, yInput, random, i, action1) {
    setTimeout(() => {
      let tempR = parseInt(action1 ? r.slice(0, -1) : r2.slice(0, -1));
      let tempT = parseInt(action1 ? t.slice(0, -1) : t2.slice(0, -1));

      tempR =
        tempR !== parseInt(xInput) && parseInt(xInput) !== 0
          ? random
            ? Math.floor(Math.random() * (-290 - 290) + 290)
            : parseInt(xInput)
          : tempR;
      tempT =
        tempT !== -parseInt(yInput) && parseInt(yInput) !== 0
          ? random
            ? Math.floor(Math.random() * (-140 - 140) + 140)
            : -parseInt(yInput)
          : tempT;
      if (parseInt(yInput) === 0) {
        tempT = 0;
      }
      if (parseInt(xInput) === 0) {
        tempR = 0;
      }

      if (tempR < -290 || tempR > 290 || tempT < -140 || tempT > 140) {
        refresh(WARN_MSG_POS);
        return;
      }
      let valueR = tempR.toString();
      let valueT = tempT.toString();

      if (action1) {
        r = valueR.concat("%");
        t = valueT.concat("%");
      } else {
        r2 = valueR.concat("%");
        t2 = valueT.concat("%");
      }

      action1
        ? (ref.current.style.transform = `scale(${scale})translate(${r}, ${t}) rotate(${angle}deg)`)
        : (ref2.current.style.transform = `scale(${scale2})translate(${r2}, ${t2}) rotate(${angle2}deg)`);
    }, i * 1500);
  }
  const rotate = (rAngle, i, action1) => {
    setTimeout(() => {
      action1 ? (angle += rAngle) : (angle2 += rAngle);
      action1
        ? (ref.current.style.transform = `scale(${scale})translate(${r}, ${t}) rotate(${angle}deg)`)
        : (ref2.current.style.transform = `scale(${scale2})translate(${r2}, ${t2}) rotate(${angle2}deg)`);
    }, i * 1500);
  };

  const startActions = (action, idx, action1, reverse = false) => {
    switch (action) {
      case "move x by 10": {
        if (reverse) moveLeft(idx, action1); // Reverse direction if needed
        else moveRight(idx, action1);
        break;
      }
      case "move y by 10": {
        if (reverse) moveDown(idx, action1); // Reverse direction if needed
        else moveUp(idx, action1);
        break;
      }
      case "move x by -10": {
        if (reverse) moveRight(idx, action1); // Reverse direction if needed
        else moveLeft(idx, action1);
        break;
      }
      case "move y by -10": {
        if (reverse) moveUp(idx, action1); // Reverse direction if needed
        else moveDown(idx, action1);
        break;
      }
      case "rotate 45": {
        rotate(reverse ? -45 : 45, idx, action1); // Reverse rotate if needed
        break;
      }
      case "rotate 90": {
        rotate(reverse ? -90 : 90, idx, action1); // Reverse rotate if needed
        break;
      }
      case "rotate 135": {
        rotate(reverse ? -135 : 135, idx, action1); // Reverse rotate if needed
        break;
      }
      case "rotate 180": {
        rotate(reverse ? -180 : 180, idx, action1); // Reverse rotate if needed
        break;
      }
      case "rotate 360": {
        rotate(reverse ? -360 : 360, idx, action1); // Reverse rotate if needed
        break;
      }
      case "random position": {
        moveXY(1, 1, true, idx, action1);
        break;
      }
      case "move (0, 0)": {
        moveXY(0, 0, false, idx, action1);
        break;
      }

      case "repeat": {
        const actionsToRepeat = action1 ? actions : actions2;

        // Track the reverse state for the current loop
        let isReversed = reverse;

        const runNextAction = (currentIndex) => {
          if (currentIndex < actionsToRepeat.length) {
            startActions(
              actionsToRepeat[currentIndex].todo,
              currentIndex,
              action1,
              isReversed
            );

            // Check for collision after performing each action
            if (checkCollision()) {
              // Handle the collision, and reverse the direction for subsequent actions
              handleCollision(
                parseInt(action1 ? r.slice(0, -1) : r2.slice(0, -1)),
                action1
              );

              // Reverse the direction for the next action and continue the loop
              isReversed = !isReversed; // Toggle reverse state
            }

            // Continue to the next action after a short delay
            setTimeout(() => runNextAction(currentIndex + 1), 1500);
          }
        };
        runNextAction(0); // Start the repeat loop from the first action
        break;
      }

      default:
        break;
    }
  };

  // Helper function to reverse the last action upon collision
  const reverseLastAction = (action, idx, action1) => {
    switch (action.todo) {
      case "move x by 10":
        moveLeft(idx, action1); // Reverse move right
        break;
      case "move y by 10":
        moveDown(idx, action1); // Reverse move up
        break;
      case "move x by -10":
        moveRight(idx, action1); // Reverse move left
        break;
      case "move y by -10":
        moveUp(idx, action1); // Reverse move down
        break;
      case "rotate 45":
        rotate(-45, idx, action1); // Reverse rotate
        break;
      // Add other cases as needed
      default:
        break;
    }
  };

  function clearTimeouts() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  const refresh = (msg) => {
    r = "0%";
    t = "0%";
    r2 = "0%";
    t2 = "0%";
    scale2 = 1;
    angle2 = 0;
    scale = 1;
    angle = 0;

    clearTimeouts();
    setHello(false);

    if (msg) {
      toast.warn(msg, {
        position: "top-center",
        autoClose: 2000,
        borderRadius: "20px",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    if (ref.current) {
      ref.current.style.transform = `scale(${scale}) translate(${r}, ${t}) rotate(${angle})`;
    }

    if (ref2.current) {
      ref2.current.style.transform = `scale(${scale2}) translate(${r2}, ${t2}) rotate(${angle2})`;
    }
  };

  function runAction1() {
    actions &&
      actions.map((item, i) => {
        startActions(item.todo, i, true);
        return;
      });
  }
  function runAction2() {
    !displayAddIcon &&
      actions2 &&
      actions2.map((item, i) => {
        startActions(item.todo, i, false);
        return;
      });
  }

  return (
    <div className="mainContainer">
      <ToastContainer />

      <div
        className="playRefresh"
        style={{
          justifyContent: "flex-end",
          display: "flex",
          marginTop: "1rem",
          marginBottom: "-2rem",
        }}
      >
        <Positions handleMove={moveXY} refresh={refresh} />

        <div className="gameProps" style={{ marginTop: "-0.5rem" }}>
          <Sprites
            setSprite={setSprite}
            setSprite2={setSprite2}
            displayAddIcon={displayAddIcon}
            sprite2={sprite2}
            sprite={sprite}
          />
        </div>
        <Button
          variant="contained"
          sx={{
            borderRadius: "20px",
            marginRight: "3px",
            height: "40px",
            width: "80px",
            marginTop: "2rem",
          }}
          color="success"
          onClick={() => {
            runAction1();
            runAction2();
          }}
        >
          <PlayArrowIcon />
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: "20px",
            height: "40px",
            width: "80px",
            marginTop: "2rem",
          }}
          color="error"
          onClick={refresh}
        >
          <RefreshIcon sx={{ color: "white" }} />
        </Button>
      </div>
      <div className="container">
        <Droppable droppableId="MovesList">
          {(provided) => (
            <div
              className="moves"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="moves__heading">Moves</div>
              {moves?.map((move, index) => (
                <SingleAction
                  disableDelete={true}
                  index={index}
                  moves={moves}
                  move={move}
                  key={move.id}
                  setMoves={setMoves}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="MovesActions">
          {(provided) => (
            <div
              className="moves actions"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <span className="moves__heading">Actions</span>
              {actions?.map((move, index) => (
                <SingleAction
                  index={index}
                  moves={actions}
                  move={move}
                  key={move.id}
                  refresh={refresh}
                  setMoves={setActions}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {displayAddIcon && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="icon">
              <AddBoxIcon
                sx={{ color: "gray", cursor: "pointer" }}
                onClick={() => {
                  setDisplayAddIcon(!displayAddIcon);
                  setSprite2(require("../Assets/images/jerry1.png"));
                  refresh();
                }}
              />
              <span class="tooltiptext">Add</span>
            </div>
            <div>
              <DeleteIcon
                onClick={() => {
                  setActions([]);
                }}
                sx={{ cursor: "pointer", fontSize: "30px", color: "Grey" }}
              />
            </div>
          </div>
        )}
        {!displayAddIcon && (
          <Droppable droppableId="MovesActions2">
            {(provided) => (
              <div
                className="moves actions"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span className="moves__heading">Action 2</span>
                {actions2?.map((move, index) => (
                  <SingleAction
                    index={index}
                    moves={actions2}
                    move={move}
                    key={move.id}
                    refresh={refresh}
                    setMoves={setActions2}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        {!displayAddIcon && (
          <div className="icon">
            <DisabledByDefaultIcon
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={() => {
                setDisplayAddIcon(!displayAddIcon);
                setSprite2(null);
                refresh();
              }}
            />
            <div>
              <DeleteIcon
                onClick={() => {
                  setActions([]);
                  setActions2([]);
                }}
                sx={{ cursor: "pointer", fontSize: "30px", color: "Grey" }}
              />
            </div>
          </div>
        )}

        <div
          className="moves play"
          style={{
            background: theme
              ? 'url("https://www.hp.com/us-en/shop/app/assets/images/uploads/prod/misty-forest-background1595620320482968.jpg?impolicy=prdimg&imdensity=1&imwidth=1000")'
              : null,
            backgroundSize: theme ? "100% 100%" : null,
          }}
        >
          <Draggable1
            bounds={{ left: -540, top: -250, right: 540, bottom: 250 }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                ref={ref}
                style={{
                  position: "relative",
                  transition: "1s all ease",
                }}
              >
                {hello ? (
                  <div
                    style={{ transition: "0s all ease" }}
                    className="msgPopup"
                  >
                    hello!
                  </div>
                ) : null}
                <img
                  src={sprite}
                  draggable="false"
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    height: 200,
                    width: 200,
                    transition: "1s all ease",
                  }}
                />
              </div>
              {!displayAddIcon && (
                <div
                  ref={ref2}
                  style={{
                    position: "relative",
                    transition: "1s all ease",
                  }}
                >
                  {hello2 ? (
                    <div
                      style={{ transition: "0s all ease" }}
                      className="msgPopup"
                    >
                      hello!
                    </div>
                  ) : null}
                  <img
                    src={sprite2}
                    draggable="false"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      height: 200,
                      width: 200,
                      transition: "1s all ease",
                    }}
                  />
                </div>
              )}
            </div>
          </Draggable1>
        </div>
      </div>
    </div>
  );
};
export default EventBody;
