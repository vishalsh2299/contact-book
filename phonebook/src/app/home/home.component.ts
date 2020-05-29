import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  length = 0
  pageSize = 4
  pageoffset = 0
  
  pageSizeOptions: number[] = [4, 8, 16]
  loading = true





  send_name = ""
  send_dob = ""
  send_number = []
  send_emailid = []
  send_id_forupdate = ""


  filter = ""


  status = 1



  contacts: any
  constructor(private http:HttpClient) { 
    this.getContacts()
  }

  ngOnInit(): void {
  }

  getContacts() {
    this.loading = true
    if(this.filter == ""){
      console.log("Normal")
      this.getContactsNormal()
    }else{
      console.log("Filter")
      this.getContactsFilter()
    }
  }

  getContactsNormal(){
    console.log("Working Normal")
    this.http.post(BackendService.baseDomainUrl + "api/contact",{'pagelimit':this.pageSize,'pageoffset':this.pageoffset}).toPromise().then((value)=>{
      this.contacts = value['data']
      this.loading = false
      this.length = value['count']
      console.log(value)
    }).catch((error)=>{
      this.loading = false
      console.log(error)
    })
  }
  getContactsFilter() {
    console.log("Working Filter")
    this.http.post(BackendService.baseDomainUrl + "api/contact/filter",{'filter':this.filter,'pagelimit':this.pageSize,'pageoffset':this.pageoffset}).toPromise().then((value)=>{
      this.loading = false
      this.contacts = value['data']
      this.length = value['count']
      console.log(value)
    }).catch((error)=>{
      console.log(error)
    })
  }
  applySearch(event){
    this.loading = false
    this.filter = event.target.value
    this.getContacts()
  }

  createNewView(){
    this.status = 2
    this.send_name = ""
    this.send_dob = ""
    this.send_number = []
    this.send_emailid = []
    this.send_number.push({number:""})
    this.send_emailid.push({emailid:""})
  }

  saveNewContact(){
    this.loading = true
    this.http.post(BackendService.baseDomainUrl + "api/new",{
      "data":{
        "name" :this.send_name,
        "dob" :this.send_dob,
        "phonenumbers":this.send_number,
        "emailid":this.send_emailid
      }
    }).toPromise().then((value)=>{
      this.loading = false
      this.status = 1
      this.getContacts()
      console.log(value)
    }).catch((error)=>{
      this.loading = false
      console.log(error)
    })
  }

  contactEdit(contact){
    this.loading = true
    this.send_id_forupdate = contact._id
    this.send_name = contact.name
    this.send_dob = contact.dob
    this.send_number = []
    this.send_emailid = []
    contact.phonenumbers.forEach(element => {
      this.send_number.push({'number':element.number})
    });
    contact.emailid.forEach(element => {
      this.send_emailid.push({'emailid':element.emailid})
    });
    console.log(contact)
    this.status = 3
    this.loading = false
  }
  contactDelete(contact){
    this.loading = true
    this.http.post(BackendService.baseDomainUrl+"api/remove",{"id":contact._id}).toPromise().then((value)=>{
      if(value == "0"){
        this.loading = false
        this.getContacts()
      }else{
        this.loading = false
        //ERROR
      }
    }).catch((error)=>{
      console.log(error)
    })
  }

  updateNewContact(){
    

    
    this.loading = true
    this.http.put(BackendService.baseDomainUrl + "api/update",{
      "data":{
        "name" :this.send_name,
        "dob" :this.send_dob,
        "phonenumbers":this.send_number,
        "emailid":this.send_emailid
      },
      id: this.send_id_forupdate
    }).toPromise().then((value)=>{
      if(value == "0"){
        this.loading = false
        this.getContacts()
        this.status = 1
      }else{
        this.loading = false
        //ERROR
      }
    }).catch((error)=>{
      console.log(error)
    })
  
  }

  pageEvent(event){
    
  console.log(event)
    this.pageSize = event.pageSize
    this.pageoffset = event.pageIndex * event.pageSize
    this.getContacts()
  }

  removeNumber(i){
    this.send_number.splice(i,1)
    console.log(i)
  }
  removeEmail(j){
    this.send_emailid.splice(j,1)
  }
}
