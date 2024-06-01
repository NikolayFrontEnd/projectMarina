
import SignUpForm from './components/registration';
import Main from './components/main';
import { Routes, Route } from "react-router-dom";
import Subjects from './components/AllSubjects';
import CreateSemestr from './components/createSemestr';
import CreateSubject from './components/createSubject';
import Sub from './components/Subject';
import Sdacha from './components/RightOnSdazha';
import CreateQueue from './components/createQuue';
function App() {
  return (
    <div >
      
       <Routes> 
 <Route path ="/" element =   {<SignUpForm/>}/>
 <Route path = "/main" element = {<Main/>}/>
 <Route path = "/subjects/:semesterId" element = {<Subjects/>}/>
 <Route path = "/createSemestr" element = {<CreateSemestr/>}/>
<Route path = "/createSubject/:semesterId" element = {<CreateSubject/>}/>
<Route path = "/subject/:semesterId/:subjectId" element = {<Sub/>}/>
<Route path = "/deleteQueue/:semesterId/:eventId" element = {<Sdacha />} />
<Route path = "/doQueue/:semesterId/:subjectId" element = {< CreateQueue/>}/>
      </Routes>   



    </div>
  );
}

export default App;
