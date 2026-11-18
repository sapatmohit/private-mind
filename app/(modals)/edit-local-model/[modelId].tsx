import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useModelStore } from '../../../store/modelStore';
import GlassScreenHeader, {
  useGlassScreenHeaderHeight,
} from '../../../components/GlassScreenHeader';
import { fontSizes, fontFamily } from '../../../styles/fontStyles';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import PrimaryButton from '../../../components/PrimaryButton';
import { ScrollView } from 'react-native-gesture-handler';
import UploadInput from '../../../components/UploadInput';
import { InfoAlert } from '../../../components/InfoAlert';
import TextFieldInput from '../../../components/TextFieldInput';
import Toast from 'react-native-toast-message';
import { Theme } from '../../../styles/colors';
import { LocalModelFormState } from '../add-local-model';
import { CustomKeyboardAvoidingView } from '../../../components/CustomKeyboardAvoidingView';
import { Feedback } from '../../../utils/Feedback';
import { space } from '../../../constants/design-system';

type LocalFile = {
  name: string;
  size: number | null;
  uri: string;
};

interface EditModelFormState extends LocalModelFormState {
  modelName: string;
}

const parsePathToLocalFile = (path?: string): LocalFile | null => {
  if (!path) return null;
  return {
    name: path.split('/').pop() || '',
    size: null,
    uri: path.replace('file://', ''),
  };
};

export default function EditLocalModelScreen() {
  const { t } = useTranslation();
  const { modelId: rawModelId } = useLocalSearchParams<{ modelId: string }>();
  const modelId = parseInt(rawModelId);

  const router = useRouter();
  const headerHeight = useGlassScreenHeaderHeight(true);
  const { styles } = useThemedStyles(createStyles, headerHeight);

  const { getModelById, editModel } = useModelStore();
  const model = getModelById(modelId);

  const [
    { modelName, localModelPath, localTokenizerPath, localTokenizerConfigPath },
    setFormState,
  ] = useState<EditModelFormState>({
    modelName: model?.modelName || '',
    localModelPath: parsePathToLocalFile(model?.modelPath),
    localTokenizerPath: parsePathToLocalFile(model?.tokenizerPath),
    localTokenizerConfigPath: parsePathToLocalFile(model?.tokenizerConfigPath),
  });

  const setFormField = <K extends keyof EditModelFormState>(
    field: K,
    value: EditModelFormState[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!localModelPath || !localTokenizerPath || !localTokenizerConfigPath) {
      Alert.alert(t("model-id.missingFields"), t("model-id.pleaseSelectAllNecessaryFiles"));
      return;
    }
    await editModel(
      modelId,
      localTokenizerPath.uri,
      localTokenizerConfigPath.uri,
      modelName
    );
    Feedback.editSave();
    Toast.show({
      type: 'defaultToast',
      text1: t("model-id.modelnameHasBeenSuccessfullyUpdated", { modelName }),
    });
    router.back();
  };

  return (
    <CustomKeyboardAvoidingView
      isModalScreen
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.textFieldSection}>
            <Text style={styles.label}>{t("model-id.modelName")}</Text>
            <TextFieldInput
              value={modelName}
              onChangeText={(text) => setFormField('modelName', text)}
            />
          </View>
          <View style={styles.textFieldSection}>
            <Text style={styles.label}>{t("model-id.modelFile")}</Text>
            <UploadInput
              fileInfo={localModelPath}
              onChange={(file) => setFormField('localModelPath', file)}
              disabled
            />
            <InfoAlert text="Model file is permanently linked to this model and cannot be changed" />
          </View>
          <View style={styles.textFieldSection}>
            <Text style={styles.label}>{t("model-id.tokenizerFile")}</Text>
            <UploadInput
              fileInfo={localTokenizerPath}
              onChange={(file) => setFormField('localTokenizerPath', file)}
            />
          </View>
          <View style={styles.textFieldSection}>
            <Text style={styles.label}>{t("model-id.tokenizerConfigFile")}</Text>
            <UploadInput
              fileInfo={localTokenizerConfigPath}
              onChange={(file) =>
                setFormField('localTokenizerConfigPath', file)
              }
            />
          </View>
        </ScrollView>
        <PrimaryButton text="Save changes" onPress={handleSave} />
      </View>
      <GlassScreenHeader
        title={t("model-id.editLocalModel")}
        onBack={() => router.back()}
        icon="close"
        sheet
      />
    </CustomKeyboardAvoidingView>
  );
}

const createStyles = (theme: Theme, headerHeight: number) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
      backgroundColor: theme.bg.softPrimary,
    },
    container: {
      flex: 1,
      paddingHorizontal: space.four,
      paddingBottom: theme.insets.bottom + 16,
      justifyContent: 'space-between',
    },
    scrollViewContent: {
      gap: space.six,
      paddingTop: headerHeight + 24,
      paddingBottom: space.six,
    },
    textFieldSection: {
      gap: space.four,
    },
    label: {
      fontSize: fontSizes.md,
      fontFamily: fontFamily.medium,
      color: theme.text.primary,
    },
  });
