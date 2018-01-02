
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './../services/employeeService';
import { Employee } from './../domain/employee';
import { Employeeclass } from './../domain/employeeclass';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [EmployeeService]
})
export class EmployeesComponent implements OnInit {

  clonedSelectedEmployee: Employee;
  indexSelected: number;

  employeeList: Employee[];
  selectedEmployee: Employee;
  cloneEmployee: Employee;
  isNewEmployee: boolean;
  displayDialog: boolean;
  loading: boolean;
  employee: Employee = new Employeeclass();

  userform: FormGroup;
  
  submitted: boolean;

constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.loading = true;
    setTimeout(() => {
      this.employeeService.getEmployees().then(employees => this.employeeList = employees);
      this.loading = false;
    }, 1000);
    //this.selectedEmployee = this.employeeList[0]; 
  }

  addEmployee() {
    this.isNewEmployee = true;
     this.selectedEmployee = new Employeeclass;
    this.displayDialog = true;
  }

  saveEmployee() {
    let tmpEmployeeList = [...this.employeeList];
    if(this.isNewEmployee){
        this.employeeService.addEmployees(this.selectedEmployee);
        tmpEmployeeList.push(this.selectedEmployee);
    }else{
        this.employeeService.saveEmployees(this.selectedEmployee);
        tmpEmployeeList[this.employeeList.indexOf(this.selectedEmployee)] = this.selectedEmployee;
    }
 
    this.employeeList = tmpEmployeeList;
    this.selectedEmployee = null;
    this.displayDialog = false;
 
  }

  deleteEmployee(){
    if(this.selectedEmployee){
      let index = this.findSelectedEmployeeIndex();
      this.employeeList = this.employeeList.filter((val,i) => i!=index);
      this.employeeService.deleteEmployees(this.selectedEmployee.employeeId);
      this.selectedEmployee = null;
      this.displayDialog = false;
    }
     
  }

  onRowSelect(event) {
          this.isNewEmployee = false;
          this.selectedEmployee;
          this.cloneEmployee = this.cloneRecord(this.selectedEmployee);
          this.displayDialog = true;
  } 

  cloneRecord(r: Employee): Employee {
      let employee = new Employeeclass();
      for(let prop in r) {
          employee[prop] = r[prop];
      }
      return employee;
  }

  cancelEmployee(){
    this.isNewEmployee = false;
    let tmpEmployeeList = [...this.employeeList];
    tmpEmployeeList[this.employeeList.indexOf(this.selectedEmployee)] = this.cloneEmployee;
    this.employeeList = tmpEmployeeList;
    this.selectedEmployee = this.cloneEmployee;
    this.selectedEmployee = null;
  }

  findSelectedEmployeeIndex(): number {
      return this.employeeList.indexOf(this.selectedEmployee);
  }
}
