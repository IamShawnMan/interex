import React, { PureComponent } from 'react';
import { BarChart,Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReChart = (props) => {
   
    return ( <BarChart width={730} height={250} data={props?.data||[]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="barchasi" fill="blue" />
        <Bar dataKey="sotilgani" fill="green" />
        <Bar dataKey="qaytgani" fill="red" />
      </BarChart> );
}
 
export default ReChart;