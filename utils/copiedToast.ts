import { t } from '../i18n';
import Toast from 'react-native-toast-message';

export const showCopiedToast = () => {
  Toast.show({ type: 'defaultToast', text1: t('copied-toast.messageCopied') });
};
