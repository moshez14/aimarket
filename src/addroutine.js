import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Addroutine({ user_ID, onSubmitRoutine }) {
  const [routineName, setroutineName] = useState('');

  const handleNameChange = (event) => {
    setroutineName(event.target.value);
  };

  const [showAdditionalCode, setShowAdditionalCode] = useState(false);
  const [selectedroutine, setSelectedroutine] = useState(null);
  const [usersetting, setusersettings] = useState([]);

  const submitroutineDataToMongoDB = async (e) => {
    e.preventDefault();
    try {
    onSubmitRoutine(routineName);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const addroutine = () => {
    setShowAdditionalCode(true);
  };

  const closeroutine = () => {
    setShowAdditionalCode(false);
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/userroutines', {
        params: {
          user_ID: user_ID,
        },
      });
      const { data } = response;
      if (Array.isArray(data)) {
        setusersettings(data);
      } else {
        console.error('Invalid user sources data:', data);
      }
    } catch (error) {
      console.error('Error fetching user sources:', error);
    }
  };

  const handleroutineRadioChange = (routineId) => {
    setSelectedroutine(routineId === selectedroutine ? null : routineId);
  };

  const selectedroutineData = usersetting
    .flatMap((usersettings) => usersettings.routines)
    .find((routines) => routines._id.$oid === selectedroutine);

  return (
    <div className="App">
      {showAdditionalCode ? (
        <>
          <button onClick={closeroutine}>Close Add routine</button>
          <h1>Add routine</h1>
          <div className="box">
            <label htmlFor="routineName">routine Name:</label>
            <input type="text" id="routineName" value={routineName} onChange={handleNameChange} />
            <button onClick={submitroutineDataToMongoDB}>Submit</button>

            <div className="box">
              <h2>chose routine:</h2>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="radio"
                        name="selectedroutine"
                        value="none"
                        checked={selectedroutine === null}
                        onChange={() => handleroutineRadioChange(null)}
                      />
                    </td>
                    <td>None</td>
                    <td></td>
                  </tr>
                  {usersetting.map((usersettings) =>
                    usersettings.routines.map((routine) => (
                      <tr key={routine._id.$oid}>
                        <td>
                          <input
                            type="radio"
                            name="selectedroutine"
                            value={routine._id.$oid}
                            checked={routine._id.$oid === selectedroutine}
                            onChange={() => handleroutineRadioChange(routine._id.$oid)}
                          />
                        </td>
                        <td>{routine.routineName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <button onClick={addroutine}>Add routine</button>
      )}
    </div>
  );
}

export default Addroutine;
