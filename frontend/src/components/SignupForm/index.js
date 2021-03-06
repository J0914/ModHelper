import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {signup} from '../../store/session'
import {useHistory} from 'react-router-dom'
import styles from './signupform.module.css';

 const SignupForm = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [credentialBorder, setCredentialBorder] = useState('black')
  const [passwordBorder, setPasswordBorder] = useState('black')
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [photo, setPhoto] = useState('');
  const [modId, setModId] = useState(1);

  const mods = Object.values(useSelector(state => state.mods.allMods));

  const [emailErr, setEmailErr] = useState([]);
  const [passwordErr, setPasswordErr] = useState([]);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState([]);
  const [run, setRun] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if(mods) setModId(5);
  }, [mods])

  useEffect(() => {
    setEmailErr([])
    setPasswordErr([])

    if (credential) {
      const emailRegex = new RegExp('[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}', 'i');
      if (!emailRegex.test(credential)) {
        setCredentialBorder('red')
        setEmailErr(['Please enter a valid email.'])
      }
      else if (emailRegex.test(credential)) setCredentialBorder('green')
    } else setCredentialBorder('black')
    if (password) {
      if (password.length < 6) {
        setPasswordBorder('red')
        setPasswordErr(['Password should be 6 or more characters.'])
      }
      else if (password.length >= 6) setPasswordBorder('green')
      else setPasswordBorder('black')
    }
    if (password && confirmPassword) {
      if (confirmPassword && password !== confirmPassword) {
        setPasswordBorder('red')
      }
      else if (password === confirmPassword) setPasswordBorder('green')
    } else setPasswordBorder('black')

  }, [run])

  const onSubmit = async (e) => {
    e.preventDefault();

    setErrors([])
    const user = {
      email: credential, 
      password, 
      fname, 
      lname, 
      modId
    }

    await dispatch(signup(user))
    .then(() => history.push('/dashboard'))
    .catch(async(res) => {
      const data = await res.json();
      setErrors(data.errors)
    })
  }

  return(
    <div className={styles.formContainer}>
      <form onSubmit={onSubmit} id={styles.signupForm}>
      <h1 className={styles.signupFormHeader}>Signup</h1>
        <div className={styles.errors}>
          <ul>
            {errors.map(err => (
              <li className={styles.backendErr} key={err}>{err}</li>
            ))}
          </ul>
        </div>
          <label htmlFor='credential'>Email</label>
        <div className={styles.inputHolder}>
          <input 
          style={{border:`2px solid ${credentialBorder}`}}
          
          id={styles.credential}
          type='text'
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder='Enter Email'
          />
        </div>
          <label htmlFor='password'>Password</label>
        <div className={styles.inputHolder}>
          <input 
          style={{border:`2px solid ${passwordBorder}`}}
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter Password'
          />
        </div>
          <label htmlFor='confirmPassword'>Confirm Password</label>
        <div className={styles.inputHolder}>
          <input 
          style={{border:`2px solid ${passwordBorder}`}}
          id='confirmPassword'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='Re-enter Password'
          />
        </div>
        <label htmlFor='fname'>First Name</label>
        <div className={styles.inputHolder}>
          <input 
          style={{border:`2px solid ${passwordBorder}`}}
          id='fname'
          type='text'
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          placeholder='Enter First Name'
          />
        </div>
        <label htmlFor='lname'>Last Name</label>
        <div className={styles.inputHolder}>
          <input 
          style={{border:`2px solid ${passwordBorder}`}}
          id='lname'
          type='text'
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          placeholder='Enter Last Name'
          />
        </div>
        <label htmlFor='modId'>Choose your mod</label>
        <div className={styles.inputHolder}>
          <select
          id='modId'
          value={modId}
          onChange={(e) => setModId(e.target.value)}
          >
            {mods && mods.map(mod => (
              <option 
              key={mod.id} 
              value={mod.id}
              >{mod.title}
              </option>
            ))}
          </select>
        </div>
        <button
        type='submit'
        className={styles.submitBtn}
        >
          Submit
        </button>
      </form>
    </div>
  )
 }

export default SignupForm;