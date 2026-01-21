import { STATIONS } from '../../constants/stations';
import MainPageLayout from './organisms/MainPageLayout';

export default function MainPage() {
  return <MainPageLayout stations={STATIONS} />;
}
