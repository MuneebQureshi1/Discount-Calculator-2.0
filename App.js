import React,{ useState,useEffect } from 'react';
import { Text, View, StyleSheet,Button,TextInput,TouchableOpacity,FlatList,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable } from 'react-native-paper';

const HomeScreen = ({ navigation,route }) => {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrc, setDicountPrc] = useState("");
  const [savedAmount, setSavedAmount] = useState("0.00");
  const [finalPrice, setFinalPrice] = useState("0.00");
  const [history, setHistory] = useState([]);
  const [calError, setCalError] = useState("");
  const [show, setshow] = useState(false);
  saveResult = () => {
   
    setHistory(oldHistory => [...history,{ originalp:originalPrice,finalp:finalPrice,dicountp:discountPrc}]);

      setOriginalPrice("");
      setDicountPrc("");
  }
  useEffect(() => {
    if(originalPrice === "" || discountPrc === ""){
        setshow(false)
    }
    else if (discountPrc <= 100 && originalPrice >= 0 && discountPrc >= 0) {
      var saved = (originalPrice * discountPrc) / 100;
      var final_Price = originalPrice - saved;
      setSavedAmount(saved.toFixed(2));
      setFinalPrice(final_Price.toFixed(2));      
      setCalError("");
      setshow(true)
    } else if (discountPrc > 100) {
      setCalError("Discount Cannot be greater than 100%");
      setshow(false)
    } else if (originalPrice < 0 || discountPrc < 0) {
      setCalError("Original Price or Discount Price must be greater than 0");
      setshow(false)
    }
    else
    {
      setCalError("Invalid Input");
       setshow(false)
    }    
  });

  return (
   <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Discount Calculator</Text>
      </View>
      <View style={styles.mainView}>
      <View>
      <Text style={{color:"white",fontSize:30}}>Price:</Text>
        <TextInput keyboardType={"number-pad"} value={originalPrice} onChangeText={(orgPrice) => setOriginalPrice(orgPrice)} style={styles.textFields}  /></View>
        <View style={{ paddingTop: 10 }} />
        <View>
        <Text style={{color:"white",fontSize:30}}>Discount:</Text>
        <TextInput keyboardType={"number-pad"} maxLength={2} value={discountPrc} onChangeText={(discountPercentage) => setDicountPrc(discountPercentage)} style={styles.textFields} />
        </View>
        <View style={{padding:25}}>
        <Text style={styles.textStyle} >Final Price:{finalPrice}</Text>
         <Text style={styles.textStyle}>Saved Amount:{savedAmount}</Text>
         <Text style={styles.textStyle,{color:'red'}}>{calError}</Text>
         </View>
<View style={{flexDirection:'row',marginTop:10 }}>
        <View style={{ paddingTop: 10 }} />
        { show ? <TouchableOpacity onPress={() => saveResult()} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Result</Text>
        </TouchableOpacity> :null}
        <View style={{ paddingTop: 10,marginLeft:5 }} />
        <TouchableOpacity onPress={() => navigation.navigate('History Screen', {
            historyObj: history,
          })} style={styles.historyBtn}>
          <Text style={styles.historyBtnText}>View History</Text>
        </TouchableOpacity>
</View>
        </View>
        </View>
  );
}
const HistoryScreen = ({ navigation, route }) => {
    const [history, setHistory] = useState(route.params.historyObj); 
    
   const deleteItem = (index) => {
    const newHistroy = history.filter((_,i) => i!=index)
    setHistory(newHistroy)
  }
    const clearhistory=()=>{
      for (let i=0;i<history.length;i++){
            setHistory(delete history[i]);
      }
    };
    
 return( 
   <DataTable >
    <DataTable.Header >
      <DataTable.Title>Original Price</DataTable.Title>
      <View style={{padding:2}}/>
      <DataTable.Title >Final Price</DataTable.Title>
      <DataTable.Title >Discount %</DataTable.Title>
      <DataTable.Title >Delete</DataTable.Title>
    </DataTable.Header>
  <FlatList
        
        data={history}
        renderItem={({item ,index}) => {
          return (

    <DataTable.Row>
      <DataTable.Cell>{item.originalp}</DataTable.Cell>
      <DataTable.Cell numeric>{item.finalp}</DataTable.Cell>
      <DataTable.Cell numeric>{item.dicountp}</DataTable.Cell>
      <DataTable.Cell><TouchableOpacity onPress={() => deleteItem(index)} style={{backgroundColor:'blue', borderStyle:'solid',borderRadius:25,width:20,alignItems:"center"}} >
          <Text style={{color:'white',fontSize:20}}>x</Text>
        </TouchableOpacity></DataTable.Cell>
    </DataTable.Row>


          );
        }}
        keyExtractor={(index) => { 
          return index 
          }}

        
      />
      <DataTable.Pagination
      page={1}
      numberOfPages={3}
      onPageChange={page => {
        console.log(page);
      }}
      label="1-2 of 6"
    />
    <TouchableOpacity onPress={() => clearhistory()} style={{backgroundColor:'blue', borderStyle:'solid',borderRadius:25,width:70,marginLeft:130}} >
          <Text style={{marginLeft:10,color:'white',fontSize:20}}>Clear</Text>
        </TouchableOpacity>
  </DataTable>
 );
     
};

const Stack = createStackNavigator();

function MyStack () {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title:'Home', }}
        />
        <Stack.Screen name="History Screen" component={HistoryScreen}  options={{ headerStyle:{
          backgroundColor:"skyblue"
        } }}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize:16,
    letterSpacing:1
  },
  header: {
    backgroundColor: 'blue',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 8.0,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
  },
  headerText: {
    fontSize: 24,
    color: 'white'
  },
  mainView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor:'black',
  },
  textFields: {
    height: 50,
    width: 300,
    borderColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    fontSize: 18,
    borderRadius: 10,
    color:'white'

  },
  saveBtn: {
    height: 35,
    width: 150,
    backgroundColor: '#388E3C',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 2,
  },
  saveBtnText: {
    fontSize: 18,
    color: 'white'
  },
  historyBtn: {
     height: 35,
    width: 150,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 2,
  },
  historyBtnText: {
    fontSize: 18,
    color: 'white'
  }
});

export default MyStack;