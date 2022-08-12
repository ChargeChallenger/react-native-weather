import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert, state } from "react-native";
import * as Location from "expo-location";
import Loading from "./Loading";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Weather from "./Weather";

export default class extends React.Component {
	state = {
		isLoading: true,
	};

	getWeather = async (latitude, longitude) => {
		const {
			data: {
				main: { temp },
				weather,
			},
		} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=fbaf3ca9d094bd3ab9ab3b2c6ca1428f&units=metric`);
		this.setState({
			isLoading: false,
			temp: temp,
			condition: weather[0].main,
		});
		console.log(data);
	};

	getLocation = async () => {
		const location = await Location.getCurrentPositionAsync();
		console.log(location);
		try {
			await Location.requestForegroundPermissionsAsync();
			const {
				coords: { latitude, longitude },
			} = await Location.getCurrentPositionAsync();
			this.getWeather(latitude, longitude);
		} catch (error) {
			Alert.alert("Не могу определить местоположение", "Очень грустно :(");
		}
	};

	componentDidMount() {
		this.getLocation();
	}

	render() {
		const { isLoading, temp, condition } = this.state;
		return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />;
	}
}
