const SignupFormComponent = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [signupError, setSignupError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://www.maifocus.com:4000/api/signup', {
          name,
          password,
          email,
          phone,
        });
        console.log('Signup successful:', response.data);
      setSignupSuccess(true);
      setSignupError('');
    } catch (error) {
      console.error('Error during signup:', error);
      setSignupError('Error during signup. Please try again.');
      setSignupSuccess(false);
      }
    };
    
    return (
      <div>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button type="submit">Signup</button>
        </form>
        {signupSuccess && <p className="success">Signup successful!</p>}
      {signupError && <p className="error">{signupError}</p>}
      </div>
    );
  };
