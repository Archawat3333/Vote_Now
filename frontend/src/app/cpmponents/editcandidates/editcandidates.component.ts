import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-editcandidates',
  templateUrl: './editcandidates.component.html',
  styleUrls: ['./editcandidates.component.css']
})
export class EditcandidatesComponent implements OnInit {
  editcandidatesForm = new FormGroup({
    img: new FormControl('', [Validators.required]),
    Firstname: new FormControl('', [Validators.required]),
    Lastname: new FormControl('', [Validators.required]),
    age2: new FormControl('', [Validators.required, Validators.min(1)]),
    gender: new FormControl(''),
    intro2: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),


  })
  constructor( private http:HttpClient , private router:ActivatedRoute) {}

  id!: string ;
  image!:string;
  firstname!: string ;
  lastname!:string;
  age!: number;
  gen!:string;
  intro!: string;

  
  get img() { return this.editcandidatesForm.get('img'); }

  get Firstname() { return this.editcandidatesForm.get('Firstname'); }

  get Lastname() { return this.editcandidatesForm.get('Lastname'); }

  get age2() { return this.editcandidatesForm.get('age2'); }

  get intro2() { return this.editcandidatesForm.get('intro2'); }
  get file() {
    return this.editcandidatesForm.get('file');
  }

  gender: string[] = ['Male', 'Female', 'Other']


  results: any=[];
  results2: any=[];

  

  ngOnInit(): void {
    this.showCandidateBy()
    this.showEventBy();
  }
  showEventBy() {
    this.http.get<any>('http://localhost:3000/manageEvent/getEventBy2/'+this.router.snapshot.params['event_id']).subscribe(data2 => {
      this.results2 = data2[0];
    })

  }

  editCandidate() 
  {
    let bodyData = {
      "image" : this.image,
      "firstname": this.firstname,
      "lastname": this.lastname,
      "age": this.age,
      "gen": this.gen,
      "intro": this.intro,
      
     };

     

    

    this.http.put("http://localhost:3000/candidate/editCandidate/"+this.router.snapshot.params['id'],bodyData,{responseType:'text'}).subscribe(data => {
      alert("Update Candidate Success!");

     
      
    })
  }

  showCandidateBy() {
    this.http.get<any>('http://localhost:3000/candidate/getCandidateBy/'+this.router.snapshot.params['id']).subscribe(data => {
      this.results = data;
    })

    
  }

  onChangeImg(e: any) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      var pattern = /image-*/;
      const reader = new FileReader();
      if (!file.type.match(pattern)) {
        alert('invalid format')
        this.editcandidatesForm.reset();
      }
      else {
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            this.editcandidatesForm.patchValue({
              img: reader.result
            });
          } else {
            console.error('Reader result is not a string:', reader.result);
          }
        }
      }
    }
  }

}
