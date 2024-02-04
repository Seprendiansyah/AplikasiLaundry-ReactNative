import { useCallback, useEffect, useRef, useState } from "react";
import useHTTP from "../../hooks/useHTTP";
import useJWT from "../../hooks/useJWT";
import { ScrollView, Text, View, RefreshControl } from "react-native";
import { List } from "react-native-paper"
import useMessage from "../../hooks/useMessage";
import { BASE_URL } from "../../settings";
import { Appbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import WidgetCommonHeader from "../../widgets/commons/WidgetCommonHeader";
import WidgetCommonAuth from "../../widgets/commons/WidgetCommonAuth";

const ScreenKasList = ({navigation}) => {
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const http = useHTTP();
    const jwt = useJWT();
    const message = useMessage();
  
    const [daftarKas, setDaftarKas] = useState([])
    const [kasPagination, setKasPagination] = useState({})
    const kasSearch = useRef({value: ""});

    const onKasList = async (params) => {
        const url = `${BASE_URL}/kas/`;
        const config = {
          headers: {
            Authorization: await jwt.get(),
          },
          params
        }
        http.privateHTTP.get(url, config).then((response) => {
          const { results, ...pagination } = response.data;
          setDaftarKas(results);
          setKasPagination(pagination);
        }).catch((error) => {
          message.error(error);
        })
      }

      // const onRefresh = () => {
      //   onBarangList()
      //   console.log("direfresh....")
      // }

      useEffect(() => {
        if (isFocused) {
          onKasList()
        }
        
      }, [isFocused]);
    
      return (
        <>
          <View>
            <WidgetCommonHeader 
              back={(
                <Appbar.BackAction onPress={navigation.goBack} />
              )}
              title={"Kas"} 
              action={(
                <Appbar.Action icon="plus-circle-outline" onPress={() => {
                  navigation.navigate('ScreenKasCreate')
                }} />
              )}
            />
            <WidgetCommonAuth child={(
              <ScrollView
                style={{width: "100%"}}
                // onScroll={(e) => {console.log(e.contentOffset)}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
                }
              >
                {daftarKas.map((kas) => (
                  <List.Item
                    onPress={() => navigation.navigate("ScreenKasDetail", {id: kas._id})}
                    key={kas.id}
                    title={kas.keterangan}
                    left={props => <List.Icon {...props} icon="folder-outline" />}
                    // right={props => (
                    //   <WidgetCommonStatus status={kas.tanggal} />
                    // )}
                  />
                ))}
              </ScrollView>
    
            )} />
          </View>
        </>
      )
    }

export default ScreenKasList;