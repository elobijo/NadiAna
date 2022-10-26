import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useRecoilValue} from 'recoil';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import Button from '../../common/components/Buttons/Button';
import {Spacer16} from '../../common/components/Spacers/Spacer';
import Input from '../../common/components/Typography/TextInput/TextInput';
import NS from '../../lib/i18n/constants/namespaces';
import {Body14, Body16} from '../../common/components/Typography/Body/Body';
import Gutters from '../../common/components/Gutters/Gutters';
import {useNavigation} from '@react-navigation/native';
import {requestPromotion, verifyPromotion} from './api/user';
import styled from 'styled-components/native';
import HalfModal from '../../common/components/Modals/HalfModal';
import {userAtom} from '../../lib/user/state/state';
import VerificationCode from './components/VerificationCode';
import {VerificationError} from '../../../../shared/src/errors/User';
import {COLORS} from '../../../../shared/src/constants/colors';

const Heading = styled(Body16)({textAlign: 'center'});

const ErrorText = styled(Body14)({color: COLORS.ERROR, textAlign: 'center'});

const UpgradeAccount = () => {
  const {t} = useTranslation(NS.SCREEN.UPGRADE_ACCOUNT);
  const {goBack} = useNavigation();
  const user = useRecoilValue(userAtom);
  const [needToUpgrade, setNeedToUpgrade] = useState(false);
  const [haveCode, setHaveCode] = useState(false);
  const [haveRequested, setHaveRequested] = useState(false);
  const [haveVerified, setHaveVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorString, setErrorString] = useState<string | null>(null);

  const requestCode = async () => {
    if (user?.isAnonymous) {
      setNeedToUpgrade(true);
    } else {
      await requestPromotion();
      setHaveRequested(true);
    }
  };

  const setEmailAndPassword = async () => {
    try {
      const emailAndPasswordCredentials = auth.EmailAuthProvider.credential(
        email,
        password,
      );
      await auth().currentUser?.linkWithCredential(emailAndPasswordCredentials);

      // We get auth/id-token-revoked if not signIn again
      await auth().signInWithCredential(emailAndPasswordCredentials);

      await requestPromotion();
      setHaveRequested(true);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const reauthenticate = async () => {
    if (user?.email) {
      const emailAndPasswordCredentials = auth.EmailAuthProvider.credential(
        user?.email,
        password,
      );

      user.reauthenticateWithCredential(emailAndPasswordCredentials);
      goBack();
    }
  };

  const onCodeCompleted = async (code: number) => {
    const error = await verifyPromotion(code);

    if (!error) {
      setHaveVerified(true);
    } else {
      switch (error) {
        case VerificationError.requestNotFound:
          setErrorString(t('errors.verificationNotFound'));
          break;
        case VerificationError.requestDeclined:
          setErrorString(t('errors.verificationDeclined'));
          break;
        case VerificationError.verificationAlreadyCalimed:
          setErrorString(t('errors.verificationAlreadyClaimed'));
          break;
        case VerificationError.verificationFailed:
          setErrorString(t('errors.verificationFailed'));
          break;

        default:
          break;
      }
    }
  };

  return (
    <HalfModal>
      <Gutters>
        <Spacer16 />

        {(!needToUpgrade || haveRequested) && !haveCode && (
          <>
            <Heading>
              {haveRequested ? t('requestComplete') : t('text')}
            </Heading>
            <Spacer16 />
            {!haveRequested && (
              <Button onPress={requestCode}>{t('requestCodeButton')}</Button>
            )}
            <Spacer16 />
            {!user?.isAnonymous && (
              <Button onPress={() => setHaveCode(true)}>
                {t('haveCodeButton')}
              </Button>
            )}
          </>
        )}

        {!haveRequested && needToUpgrade && !haveCode && (
          <>
            <Heading>{t('needToUpgrade')}</Heading>
            <Spacer16 />
            <Input
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              placeholder={t('email')}
              onChangeText={setEmail}
            />
            <Spacer16 />
            <Input
              textContentType="newPassword"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              autoCorrect={false}
              placeholder={t('password')}
              onChangeText={setPassword}
            />
            <Spacer16 />
            <Button onPress={setEmailAndPassword}>{t('button')}</Button>
          </>
        )}
        {haveCode && !haveVerified && (
          <>
            <Heading>{t('enterCode')}</Heading>
            <Spacer16 />
            <VerificationCode onCodeCompleted={onCodeCompleted} />
            {errorString && (
              <>
                <Spacer16 />
                <ErrorText>{errorString}</ErrorText>
              </>
            )}
          </>
        )}
        {haveVerified && (
          <>
            <Heading>{t('authenticate')}</Heading>
            <Spacer16 />
            <Input
              textContentType="password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              placeholder={t('password')}
              onChangeText={setPassword}
            />
            <Spacer16 />
            <Button onPress={reauthenticate}>{t('activateButton')}</Button>
          </>
        )}
      </Gutters>
    </HalfModal>
  );
};

export default UpgradeAccount;
