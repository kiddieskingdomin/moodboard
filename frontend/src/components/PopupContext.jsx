// PopupContext.js
import { createContext, useContext, useState } from 'react';
import { PopupForm } from './bookingForm';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <PopupContext.Provider value={{ showPopup, setShowPopup }}>
      {children}
      <PopupForm show={showPopup} onClose={() => setShowPopup(false)} />
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);