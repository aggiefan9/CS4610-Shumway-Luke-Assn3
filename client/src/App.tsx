import { useEffect, useState } from 'react';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Reptile } from './pages/Reptile';
import { useRouter } from './hooks/useRouter';
import { NavContext } from './contexts/nav';
import { ReptileContext } from './contexts/reptile';
import { ReptileIdContext } from './contexts/repId';
import { CreateReptile } from './pages/CreateReptile';

function App() {
  const { page, setPage } = useRouter();
  const [reptileId, setReptileId] = useState(0);

  let component = <div>Not found</div>;
  if (page === "home") component = <Home />;
  else if (page === "dashboard") component = <Dashboard />;
  else if (page === "login") component = <Login />;
  else if (page === "signup") component = <Signup />;
  else if (page === "reptile") component = <Reptile />;
  else if (page === "createReptile") component = <CreateReptile />

  return (
    <NavContext.Provider value={setPage}>
      <ReptileContext.Provider value={setReptileId}>
        <ReptileIdContext.Provider value={reptileId}>
          <div>
            <nav>
              {/* <button onClick={() => setPage("home")}>Home</button> */}
              <button onClick={() => setPage("dashboard")}>Dashboard</button>
              <button onClick={() => setPage("login")}>Login</button>
              <button onClick={() => setPage("signup")}>Signup</button>
              {/* <button onClick={() => setPage("reptile")}>Reptile</button> */}
            </nav>
            {component}
          </div>
        </ReptileIdContext.Provider>
      </ReptileContext.Provider>
      
    </NavContext.Provider>
  );
}

export default App;
