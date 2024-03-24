import { StyleSheet, View } from 'react-native';
import { Appbar, TextInput, Button, List, Text } from 'react-native-paper';
import WidgetCommonValidator from '../../widgets/commons/WidgetCommonValidator';
import useMessage from '../../hooks/useMessage';
import useHTTP from '../../hooks/useHTTP';
import useJWT from '../../hooks/useJWT';
import { useState } from 'react';
import useValidator from '../../hooks/useValidator';
import useChangeListener from "../../hooks/useChangeListener";
import { BASE_URL } from '../../settings';
import WidgetCommonHeader from '../../widgets/commons/WidgetCommonHeader';
import WidgetCommonAuth from '../../widgets/commons/WidgetCommonAuth';

const ScreenKasCreate = ({ navigation }) => {
    const jwt = useJWT()
    const http = useHTTP()
    const message = useMessage();
    const changeListener = useChangeListener();
  
    const [kas, setKas] = useState({
      nomorTransaksi: "",
      keterangan: "",
      pemasukan: 0,
      pengeluaran: 0
    })

    const kasValidator = useValidator({
      nomorTransaksi: [],
      keterangan: [],
      pemasukan: [],
      pengeluaran: []
    })
  
    // const handleChangeKas = (text, field) => {
    //   setKas({...kas, [field]: text})
    // }

    const onKasCreate = async () => {
        try {
          kasValidator.reset()
          const config = {
            headers: {
              Authorization: await jwt.get(),
            },
          }
          const url = `${BASE_URL}/kas/`
          const payload = {
            ...kas,
          }
          http.privateHTTP.post(url, payload, config).then((response) => {
            message.success(config)
            navigation.goBack();
          }).catch((error) => {
            message.error(error)
            kasValidator.except(error);
            console.log(error);
          })
        } catch (error) {
          console.log(error)
        }
      }

      return (
        <>
        <View>
          <WidgetCommonHeader 
            back={(
              <Appbar.BackAction onPress={navigation.goBack} />
            )}
            title={'Tambah Kas'}
          />
          <WidgetCommonAuth child={(
            <>
            <Text>
              {JSON.stringify(kasValidator.result())}
            </Text>
              <View style={styles.container}>
              <View style={styles.wrapperControl}>
                <TextInput
                  style={styles.TextInput}
                  label="No.Transaksi"
                  autoCapitalize="none"
                  value={kas.nomorTransaksi}
                  onChangeText={text => changeListener.onChangeText("nomorTransaksi", text, kas, setKas)}
                  />
                <WidgetCommonValidator messages={kasValidator.get('nomorTransaksi')} />
                <TextInput
                  label="Keterangan"
                  autoCapitalize="none"
                  value={kas.keterangan}
                  onChangeText={text => changeListener.onChangeText("keterangan", text, kas, setKas )}
                  />
                <WidgetCommonValidator messages={kasValidator.get('keterangan')} />
                <TextInput
                  label="Pemasukan"
                  autoCapitalize="none"
                  value={kas.pemasukan}
                  onChangeText={text => changeListener.onChangeNumber("pemasukan", text, kas, setKas )}
                  />
                <WidgetCommonValidator messages={kasValidator.get('pemasukan')} />
                <TextInput
                  label="Pengeluaran"
                  autoCapitalize="none"
                  value={kas.pengeluaran}
                  onChangeText={text => changeListener.onChangeNumber("pengeluaran", text, kas, setKas )}
                  />
                <WidgetCommonValidator messages={kasValidator.get('pengeluaran')} />
              </View>
              <View style={styles.wrapperControl}>
                <Button onPress={onKasCreate} mode="contained">Simpan</Button>
              </View>
            </View>
            </>
          )} />
        </View>
        </>
      )
    }

    const styles = StyleSheet.create({
        container: {
          height: "90%",
          width: "100%",
          gap: 32,
          paddingHorizontal: 24,
          marginTop: 20
        },
        wrapperControl: {
          width: "100%",
          gap: 8
        },
      })

export default ScreenKasCreate;