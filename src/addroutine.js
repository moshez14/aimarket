import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SubmitDataToMongoDB from './submitUsersetting';
import './App.css';

function Addroutine({ user_ID, onSubmitRoutine }) {
  const [routineName, setRoutineName] = useState('');
  const [showAdditionalCode, setShowAdditionalCode] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [userSettings, setUserSettings] = useState([]);
  const [showRoutineList, setShowRoutineList] = useState(false); 
  const selectedRoutineRef = useRef(selectedRoutine);

  const handleNameChange = (event) => {
    setRoutineName(event.target.value);
  };

  const submitRoutineData = () => {
    const selectedRoutineValue = selectedRoutineRef.current || routineName;
    if (selectedRoutineValue.trim() !== '') {
      onSubmitRoutine(selectedRoutineValue); // Call the parent component's function with the new routine name
      setSelectedRoutine(selectedRoutineValue); // Update the selectedRoutine state with the new routine name
      setRoutineName(''); // Clear the input field after submitting
      setShowAdditionalCode(false);
    }
  };

  const addRoutine = () => {
    setShowAdditionalCode(true);
    setShowRoutineList(false);
    fetchSources();
  };

  const closeRoutine = () => {
    setShowAdditionalCode(false);
    fetchSources();

  };

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await axios.get('http://www.maifocus.com:4000/api/userroutine', {
        params: {
          user_ID: user_ID,
        },
      });
      const { data } = response;
      if (Array.isArray(data)) {
        setUserSettings(data);
      } else {
        console.error('Invalid user sources data:', data);
      }
    } catch (error) {
      console.error('Error fetching user sources:', error);
    }
  };
  const handleRoutineRadioChange = (routineName) => {
    setSelectedRoutine(routineName);
    selectedRoutineRef.current = routineName; // Store the latest selected routine in the ref
    fetchSources();
    submitRoutineData(); // Automatically submit the form with the selected routine
  };

  /*const handleRoutineRadioChange = (routineName) => {
    setSelectedRoutine(routineName);
    selectedRoutineRef.current = routineName; // Store the latest selected routine in the ref
  };
*/
const routindelete  = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://www.maifocus.com:4000/api/deleteRoutin', {
      userid: user_ID,
      routineName: selectedRoutine,
    });
    fetchSources();
  } catch (error) {
    console.error('Error during login:', error);
  }
};
const deleteRoutine = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://www.maifocus.com:4000/api/deleteRoutin', {
      userid: user_ID,
      routineName: selectedRoutine,
    });
    fetchSources();
    setSelectedRoutine(null); // Clear the selected routine after deletion
  } catch (error) {
    console.error('Error during login:', error);
  }
};


  return (
    
    <div>
      {showAdditionalCode ? (
        <>
          <button onClick={closeRoutine}>Close Add routine</button>
          <div>
            <label htmlFor="routineName">routine Name:</label>
            <input type="text" id="routineName" value={routineName} onChange={handleNameChange} />
            <button onClick={submitRoutineData}>Submit</button>
          </div>
        </>
      ) : (
        <div>
          {showRoutineList ? ( // Check if routine list should be displayed
            <div>
              <table>
              <thead>
                <tr>
                
                <th></th>
                <th>Selected routine: {selectedRoutine}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="radio"
                      name="selectedRoutine"
                      value="none"
                      checked={selectedRoutine === null}
                      onChange={() => handleRoutineRadioChange(null)}
                    />
                  </td>
                  
                  <td>None</td>
                </tr>
                {userSettings.map((userSetting) =>
                  userSetting.routines.map((routine) => (
                    <tr key={routine.RoutineName}>
                      <td>
                        <input
                          type="radio"
                          name="selectedRoutine"
                          value={routine.RoutineName}
                          checked={routine.RoutineName === selectedRoutine}
                          onChange={() => handleRoutineRadioChange(routine.RoutineName)}
                        />
                      </td>
                      <td>{routine.RoutineName}</td>
                    
                    </tr>
                    
                  ))
                )}
              </tbody>
              </table>
              <button onClick={deleteRoutine}>Delete</button>
            </div>
          ) : (
            <button onClick={() => setShowRoutineList(true)}>Select Routine</button>
          )}
          <button onClick={addRoutine}>Add routine</button>
        </div>
      )}
    </div>

);
}

export default Addroutine;
   /* <div className="sidebar">
      <div>
     
      {showAdditionalCode ? (
        <>
          <button onClick={closeRoutine}>Close Add routine</button>
          <div>
            <label htmlFor="routineName">routine Name:</label>
            <input type="text" id="routineName" value={routineName} onChange={handleNameChange} />
            <button onClick={submitRoutineData}>Submit</button>
            
          </div>
        </>
      ) : (
        <div>
          
          <div>
            <table>
              <thead>
                <tr>
                
                <th></th>
                <th>Selected routine: {selectedRoutine}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="radio"
                      name="selectedRoutine"
                      value="none"
                      checked={selectedRoutine === null}
                      onChange={() => handleRoutineRadioChange(null)}
                    />
                  </td>
                  
                  <td>None</td>
                </tr>
                {userSettings.map((userSetting) =>
                  userSetting.routines.map((routine) => (
                    <tr key={routine.RoutineName}>
                      <td>
                        <input
                          type="radio"
                          name="selectedRoutine"
                          value={routine.RoutineName}
                          checked={routine.RoutineName === selectedRoutine}
                          onChange={() => handleRoutineRadioChange(routine.RoutineName)}
                        />
                      </td>
                      <td>{routine.RoutineName}</td>
                    
                    </tr>
                    
                  ))
                )}
              </tbody>
            </table>
            <button onClick={addRoutine}>Add routine</button>   <button onClick={routindelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}*/

