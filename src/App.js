import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";

function App() {
  const [currentTime, setCurrentTime] = useState(DateTime.now());
  const [inputTime, setInputTime] = useState(DateTime.now().toUnixInteger());
  const [diffTime, setDiffTime] = useState(0);
  const [inputTimeTemp, setInputTimeTemp] = useState(
    DateTime.now().toUnixInteger()
  );
  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;
  const inputTimeRef = useRef(inputTime);
  inputTimeRef.current = inputTime;

  const convertToUnixEpoch = (luxonTime) => {
    return luxonTime.toUnixInteger();
  };

  const convertToHumanTime = (luxonTime) => {
    return luxonTime.toISO();
  };

  const inputOnChange = (e) => {
    setInputTimeTemp(e.target.value);
  };

  const updateInputValue = () => {
    setInputTime(inputTimeTemp);
  };

  const calculateDiff = useCallback((inputT, currentT) => {
    setDiffTime(currentT.toUnixInteger() - inputT);
    setTimeout(() => {
      calculateDiff(inputTimeRef.current, currentTimeRef.current);
    }, 500);
  }, []);

  const formatDiff = (diffT) => {
    const isPositive = diffT >= 0;
    const absDiff = Math.abs(diffT);
    let remainder = absDiff;
    const days = Math.floor(absDiff / 86400);
    remainder = remainder % 86400;
    const hours = Math.floor(remainder / 3600);
    remainder = remainder % 3600;
    const minutes = Math.floor(remainder / 60);
    remainder = remainder % 60;

    const result = `${days}d ${hours}h ${minutes}m ${remainder}s`;

    if (isPositive) {
      return `${result} seconds ago`;
    }

    return `${result} seconds to go`;
  };

  const resetInputToCurrentTime = () => {
    const timeNow = DateTime.now().toUnixInteger();
    setInputTime(timeNow);
    setInputTimeTemp(timeNow);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 500);

    calculateDiff(inputTimeRef.current, currentTimeRef.current);

    return () => clearInterval(intervalId);
  }, [calculateDiff]);

  return (
    <div className="App">
      <div className="Display">{convertToUnixEpoch(currentTime)}</div>
      <div className="Display">{convertToHumanTime(currentTime)}</div>
      <div className="Display">
        <input value={inputTimeTemp} onChange={inputOnChange} />
      </div>
      <div className="Display">{inputTime}</div>
      <div className="Display">{formatDiff(diffTime)}</div>
      <div className="Button" onClick={() => updateInputValue()}>
        UPDATE_INPUT_TIME_
      </div>
      <div className="Button" onClick={() => resetInputToCurrentTime()}>
        RESET_TO_CURRENT_TIME_
      </div>
    </div>
  );
}

export default App;
