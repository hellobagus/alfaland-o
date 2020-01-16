import {Navigation} from 'react-native-navigation'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
//Tab Screen
import Home from './Home/index'
import Settings from './Settings'

//Login
import Login from './Login'
import ChangePass from './Login/changePass'
import Reset from './Reset'

//Help Desk
import HelpDesk from './HelpDesk'
import SpecHelpDesk from './HelpDesk/SpecHelpDesk'
import SelectCategory from './HelpDesk/SelectCategory'
import CategoryHelp from './HelpDesk/CategoryHelp'
import SubmitHelpDesk from './HelpDesk/Submit'
import HistoryHelp from './HelpDesk/HistoryHelp'
import ViewHistory from './HelpDesk/ViewHistory'
import ViewHistoryStatus from './HelpDesk/ViewHistoryStatus'
import ViewHistoryDetail from './HelpDesk/ViewHistoryDetail'
import StatusHelp from './HelpDesk/StatusHelp'
import Chat from './HelpDesk/Chat'
import LiveChat from './HelpDesk/LiveChat' //Ga kepake

//Finance
import BillIndex from './Billing'
import Billing from './Billing/billing'
import SoaSearch from './Billing/soaSearch'
import SoaList from './Billing/soaList'

//Metrix
import Metrix from './Metrix'

//Overtime 
import Overtime from './Overtime'
import AddOvertime from './Overtime/AddOvertime'

//History
import Status from './Status'

//Inbox
import Inbox from './Inbox'

//Invoice
import Emergency from './Emergency'

//Profile
import Profile from './Profile'
import EditProfile from './Profile/edit'

//News
import NewsDetail from './News/NewsDetail'

// Modal
import { FixedContent } from '../components/Modal/FixedContent';

//Jika Screen Kosong
import ZonkScreen from './ZonkScreen'

//Initializing
import Initializing from './Initializing';




//Registering Component Screen
export function registerScreen(){
    Navigation.registerComponent('Initializing',()=> gestureHandlerRootHOC(Initializing));


    Navigation.registerComponent('tab.Home',()=> gestureHandlerRootHOC(Home));
    Navigation.registerComponent('tab.Settings',()=> gestureHandlerRootHOC(Settings));

    //Login
    Navigation.registerComponent('screen.Login',()=> gestureHandlerRootHOC(Login));
    Navigation.registerComponent('screen.Reset',()=> gestureHandlerRootHOC(Reset));
    Navigation.registerComponent('screen.ChangePass',()=> gestureHandlerRootHOC(ChangePass));

    //HelpDesk
    Navigation.registerComponent('screen.HelpDesk',()=> gestureHandlerRootHOC(HelpDesk));
    Navigation.registerComponent('screen.SpecHelpDesk',()=> gestureHandlerRootHOC(SpecHelpDesk));
    Navigation.registerComponent('screen.CategoryHelp',()=> gestureHandlerRootHOC(CategoryHelp));
    Navigation.registerComponent('screen.SelectCategory',()=> gestureHandlerRootHOC(SelectCategory));
    Navigation.registerComponent('screen.SubmitHelpDesk',()=> gestureHandlerRootHOC(SubmitHelpDesk));
    Navigation.registerComponent('screen.HistoryHelp',()=> gestureHandlerRootHOC(HistoryHelp));
    Navigation.registerComponent('screen.ViewHistory',()=> gestureHandlerRootHOC(ViewHistory));
    Navigation.registerComponent('screen.ViewHistoryStatus',()=> gestureHandlerRootHOC(ViewHistoryStatus));
    Navigation.registerComponent('screen.ViewHistoryDetail',()=> gestureHandlerRootHOC(ViewHistoryDetail));
    Navigation.registerComponent('screen.StatusHelp',()=> gestureHandlerRootHOC(StatusHelp));
    Navigation.registerComponent('screen.Chat',()=> gestureHandlerRootHOC(Chat));
    Navigation.registerComponent('screen.LiveChat',()=> gestureHandlerRootHOC(LiveChat)); //BElomKEpake

    //Finance
    Navigation.registerComponent('screen.Billing',()=> gestureHandlerRootHOC(BillIndex));
    Navigation.registerComponent('screen.BillingList',()=> gestureHandlerRootHOC(Billing));
    Navigation.registerComponent('screen.SoaSearch',()=> gestureHandlerRootHOC(SoaSearch));
    Navigation.registerComponent('screen.SoaList',()=> gestureHandlerRootHOC(SoaList));

    //Metrix
    Navigation.registerComponent('screen.Metrix',()=> gestureHandlerRootHOC(Metrix));

    //Overtime
    Navigation.registerComponent('screen.Overtime',()=> gestureHandlerRootHOC(Overtime));
    Navigation.registerComponent('screen.AddOvertime',()=> gestureHandlerRootHOC(AddOvertime));

    //History
    Navigation.registerComponent('tab.Status',()=> gestureHandlerRootHOC(Status));

    //Invoice
    Navigation.registerComponent('tab.Emergency',()=> gestureHandlerRootHOC(Emergency));

    //Inbox
    Navigation.registerComponent('tab.Inbox',()=> gestureHandlerRootHOC(Inbox));

    //Profile
    Navigation.registerComponent('tab.Profile',()=> gestureHandlerRootHOC(Profile));
    Navigation.registerComponent('screen.EditProfile',()=> gestureHandlerRootHOC(EditProfile));

    //Status 
    Navigation.registerComponent('screen.Status',()=> gestureHandlerRootHOC(Status));

    //News and Promo Detail
    Navigation.registerComponent('screen.NewsDetail',()=> gestureHandlerRootHOC(NewsDetail));

    //Modal
    Navigation.registerComponent('modal.FixedContent',()=> gestureHandlerRootHOC(FixedContent));

    //Jika Screen kosong
    Navigation.registerComponent('screen.ZonkScreen',()=> gestureHandlerRootHOC(ZonkScreen));


}