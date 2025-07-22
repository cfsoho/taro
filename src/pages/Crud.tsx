import { useEffect, useState } from "react";
import { Form, Button, Col, Row, Alert } from "react-bootstrap";
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import ToastDialog from "components/ToastDialog";
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getUserByUid,
  saveOrUpdateUser,
  UserData,
  LocationData
} from '../utils/userDb';
import {
  getAllCountryNames,
  getLocationsByCountry,
  detectCountryFromCoordinates,
  findMatchingCity
} from '../utils/loadLocation';

const Crud: React.FC = () => {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [cities, setCities] = useState<LocationData[]>([]);
  const [selectedCityData, setSelectedCityData] = useState<LocationData | null>(null);
  const [manualLat, setManualLat] = useState<number | ''>('');
  const [manualLng, setManualLng] = useState<number | ''>('');
  const [age, setAge] = useState<number | string>('');
  const [errormsg, setErrormsg] = useState<string | null>(null);
  const [tdshow, setTdShow] = useState(false);
  const [tdmsg, setTdMsg] = useState("");

  // 載入國家清單
  useEffect(() => {
    setCountryList(getAllCountryNames());
  }, []);

  // 載入使用者資料（編輯模式）
  useEffect(() => {
    if (uid) {
      getUserByUid(uid).then(user => {
        if (user) {
          setName(user.name);
          const dt = moment(user.birthDatetime);
          setBirthday(dt.format('YYYY-MM-DD'));
          setBirthTime(dt.format('HH:mm'));

          const detected = detectCountryFromCoordinates(user.birthLat, user.birthLng);
          setCountry(detected);

          if (detected !== '其他') {
            const opts = getLocationsByCountry(detected);
            setCities(opts);
            const match = findMatchingCity(opts, user.birthLat, user.birthLng);
            if (match) {
              setCity(match.regionCode);
              setSelectedCityData(match);
            }
          } else {
            setManualLat(user.birthLat);
            setManualLng(user.birthLng);
          }
        }
      });
    }
  }, [uid]);

  // 選擇國家後重載城市
  useEffect(() => {
    if (country && country !== '其他') {
      const matched = getLocationsByCountry(country);
      setCities(matched);
      setCity('');
      setSelectedCityData(null);
      setManualLat('');
      setManualLng('');
    }
  }, [country]);

  useEffect(() => {
    const found = cities.find(c => c.regionCode === city);
    setSelectedCityData(found || null);
  }, [city, cities]);

  useEffect(() => {
    const today = moment();
    let ageCal = today.diff(moment(birthday), 'years');
    ageCal = isNaN(ageCal) ? 0 : ageCal;
    setAge(ageCal === 0 ? "" : ageCal);
  }, [birthday]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !birthday || !birthTime ||
      (country !== '其他' && !selectedCityData) ||
      (country === '其他' && (manualLat === '' || manualLng === ''))) {
      setErrormsg("所有欄位皆為必填");
      return;
    }

    const birthDatetime = `${birthday}T${birthTime}:00`;
    const lat = country === '其他' ? Number(manualLat) : selectedCityData!.latitude;
    const lng = country === '其他' ? Number(manualLng) : selectedCityData!.longitude;

    const newUser: UserData = {
      uid: uid || uuidv4(),
      name,
      birthDatetime,
      birthLat: lat,
      birthLng: lng,
    };

    try {
      await saveOrUpdateUser(newUser);
      setTdMsg(`${name} 已儲存`);
      setTdShow(true);
      setErrormsg(null);
      navigate('/');
    } catch {
      setErrormsg("儲存失敗，請稍後再試");
    }
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setName('');
    setBirthday('');
    setBirthTime('12:00');
    setCity('');
    setSelectedCityData(null);
    setManualLat('');
    setManualLng('');
    setErrormsg(null);
  };

  const maxBirthday = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 18)));
  const minBirthday = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 90)));

  return (
    <>
      {errormsg && <Alert variant="danger"><div>{errormsg}</div></Alert>}

      <Form onSubmit={handleSubmit} onReset={handleReset}>
        <Row>
          <Form.Group as={Col} xs={12} md={6}>
            <Form.Label>名字</Form.Label>
            <Form.Control
              type="text"
              placeholder="輸入任何讓您記得這個人的方式（如姓名、小名、綽號）"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group as={Col} xs={12} md={6}>
            <Form.Label>生日 ({age})</Form.Label>
            <Form.Control
              type="date"
              max={maxBirthday}
              min={minBirthday}
              value={birthday}
              onChange={e => setBirthday(e.target.value)}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mt-3">
          <Form.Group as={Col} xs={12} md={6}>
            <Form.Label>出生時間</Form.Label>
            <Form.Control
              type="time"
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group as={Col} xs={12} md={6}>
            <Form.Label>國家</Form.Label>
            <Form.Select
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
            >
              <option value="">請選擇國家</option>
              {countryList.map(cn => (
                <option key={cn} value={cn}>{cn}</option>
              ))}
              <option value="其他">其他</option>
            </Form.Select>
          </Form.Group>
        </Row>

        {country !== '其他' ? (
          <Row className="mt-3">
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label>城市</Form.Label>
              <Form.Select
                value={city}
                onChange={e => setCity(e.target.value)}
                required
              >
                <option value="">請選擇城市</option>
                {cities.map(c => (
                  <option key={c.regionCode} value={c.regionCode}>{c.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>
        ) : (
          <Row className="mt-3">
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label>緯度 (Latitude)</Form.Label>
              <Form.Control
                type="number"
                step="0.0001"
                value={manualLat}
                onChange={e => setManualLat(parseFloat(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label>經度 (Longitude)</Form.Label>
              <Form.Control
                type="number"
                step="0.0001"
                value={manualLng}
                onChange={e => setManualLng(parseFloat(e.target.value))}
                required
              />
            </Form.Group>
          </Row>
        )}

        <Row className="mt-4">
          <Form.Group as={Col}>
            <Button variant="primary" size="sm" type="submit" className="me-2">輸入</Button>
            <Button variant="outline-primary" size="sm" type="reset">取消</Button>
            {uid && <Link className="ms-5 btn-link" to="/form">新增</Link>}
          </Form.Group>
        </Row>
      </Form>

      <ToastDialog msg={tdmsg} show={tdshow} />
    </>
  );
};

export default Crud;