import React, {useState} from 'react';
import { Button, Container, CssBaseline, Paper, TextField, Typography } from '@mui/material';

function App() {
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([
    '교수님',
    '히섭',
    '시트',
    '휘바',
    '달부',
    '널',
    '님니',
    '고구마',
    '껄룩',
    '싸제',
    '섬총각',
    '부먹',
    '린려',
    '산책',
    '왼손',
    '리즈웰',
    '로놀푸',
    '서강보살',
    '톤다운',
    '큰큰곰',
  ]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [teamRedMembers, setTeamRedMembers] = useState([]);
  const [teamBlueMembers, setTeamBlueMembers] = useState([]);

  const onClickMember = (member) => {
    if (selectedMembers.length >= 10) { return; }

    if (selectedMembers.indexOf(member) < 0) {
      const newMembers = JSON.parse(JSON.stringify(selectedMembers));
      newMembers.push(member);
      setSelectedMembers(newMembers);
    }
  };

  const onClickSelectedMember = (member) => {
    const newMembers = JSON.parse(JSON.stringify(selectedMembers));
    const index = newMembers.indexOf(member);
    newMembers.splice(index, 1);
    setSelectedMembers(newMembers);
  }

  const makeMatch = () => {
    const sortedMembers = selectedMembers
      .map((member) => [member, parseInt(Math.random() * 100)])
      .sort((a, b) => a[1] - b[1]);
    setTeamRedMembers(sortedMembers.slice(0, 5).map(x => x[0]));
    setTeamBlueMembers(sortedMembers.slice(5).map(x => x[0]));
  }

  const addNewMember = (member) => {
    const newMembers = JSON.parse(JSON.stringify(members));
    newMembers.push(member);
    setMembers(newMembers);
    setMemberInput('');
  }
  
  return (
    <>
      <CssBaseline />
      <Container>
        <Paper elevation={3} style={{ marginTop: 10, paddingBottom: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ paddingTop: 10 }}>
              <img src="/images/logo.jpg" />
            </div>
            <Typography variant="h2">흑우단 매치메이커</Typography>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <TextField
              label="닉네임"
              variant="outlined"
              size="small"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addNewMember(memberInput);
                }
              }}
            />
            <Button
              variant="contained"
              style={{ marginLeft: 10 }}
              onClick={(e) => addNewMember(memberInput)}
            >
              추가
            </Button>
          </div>
          <div style={{ marginTop: 10 }}>
          {
            members.map((member) => (
              <Button
                variant="contained"
                color={selectedMembers.indexOf(member) >= 0 ? "secondary" : "primary"}
                style={{ margin: 5 }}
                onClick={() => onClickMember(member)}
              >
                {member}
              </Button>
            ))
          }
          </div>
          <div style={{ marginTop: 10 }}>
            {
              selectedMembers.map((member) => (
                <Button
                  variant="outlined"
                  style={{ margin: 5 }}
                  onClick={() => onClickSelectedMember(member)}
                >
                  {member}
                </Button>
              ))
            }
          </div>
          {
            selectedMembers.length === 10 && (
              <>
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={makeMatch}
                  >
                    Matchmake!
                  </Button>
                </div>
                <div style={{ display: 'flex', marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <div style={{ flexGrow: 1, textAlign: 'right' }}>
                    <div style={{ color: '#ff0000', fontSize: 22 }}>team 1</div>
                    {teamRedMembers.map((member) => (<div>{member}</div>))}
                  </div>
                  <div style={{ display: 'flex', margin: 20, alignItems: 'center', justifyContent: 'center' }}>VS</div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ color: '#0000ff', fontSize: 22 }}>team 2</div>
                    {teamBlueMembers.map((member) => (<div>{member}</div>))}
                  </div>
                </div>
              </>
            )
          }
        </Paper>
      </Container>
    </>
  );
}

export default App;
