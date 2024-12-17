const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');

const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'emp_mg',
    password: 'postgres',
    port: 5432,
});

app.use(cors());
app.use(express.json());

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

app.post('/addEmployee',async(req,res)=>{
    const {name, emp_id, email, phonenum, dept, doj, role} = req.body;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

    try{
        const checkEmployee = await pool.query('SELECT * FROM employees WHERE emp_id=$1 OR email=$2',[emp_id,email]);
        if(checkEmployee.rows.length>0){
            return res.status(400).json({message: 'Employee ID or Email already exists'});
        }


        const result=await pool.query(
            'INSERT INTO employees (name, emp_id, email, phonenum, dept, doj, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, emp_id, email, phonenum, dept, doj, role]
        );
        res.status(201).json({message: 'Employee added successfully', employee: result.rows[0]});
        } catch(error){
            console.error('Error in /addEmployee route:', error);
            res.status(500).json({message:'Server error'});
        }
});

app.get('/employees/statistics', async (req, res) => {
    try {
      // Get data grouped by roles
      const roleStats = await pool.query(
        'SELECT role, COUNT(*) as count FROM employees GROUP BY role'
      );
  
      // Get data grouped by departments
      const deptStats = await pool.query(
        'SELECT dept, COUNT(*) as count FROM employees GROUP BY dept'
      );
  
      res.status(200).json({
        roles: roleStats.rows,
        departments: deptStats.rows,
      });
    } catch (error) {
      console.error('Error in /employees/statistics route:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


app.listen(5000,()=>{
    console.log('Server running on http://localhost:5000');
});