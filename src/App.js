import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Container, CssBaseline, Divider, IconButton, Paper, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DEFAULT_MEMBERS = [
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
];

function App() {
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [teamRedMembers, setTeamRedMembers] = useState([]);
  const [teamBlueMembers, setTeamBlueMembers] = useState([]);
  const [editMode, setEditMode] = useState(false);

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
    localStorage.setItem('members', JSON.stringify(newMembers));
  }

  const removeMember = (member) => {
    const newMembers = JSON.parse(JSON.stringify(members));
    const index = newMembers.indexOf(member);
    newMembers.splice(index, 1);
    setMembers(newMembers);
    localStorage.setItem('members', JSON.stringify(newMembers));
  }

  useEffect(() => {
    let storedMembers = localStorage.getItem('members');
    if (storedMembers === null) {
      localStorage.setItem('members', JSON.stringify(DEFAULT_MEMBERS));
    }
    storedMembers = JSON.parse(localStorage.getItem('members'));
    console.log(storedMembers);
    setMembers(storedMembers);
  }, []);
  
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
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10, fontSize: 18, fontWeight: 700 }}>
              <Typography>전체 멤버</Typography>
              <Button
                variant="contained"
                style={{ marginLeft: 10 }}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode === true ? '저장' : '수정'}
              </Button>
            </div>
            <Divider style={{ margin: 10, marginLeft: 5, marginRight: 5 }} />
            {
              members.map((member) => (
                <ButtonGroup
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  <Button
                    color={selectedMembers.indexOf(member) >= 0 ? "secondary" : "primary"}
                    onClick={() => onClickMember(member)}
                  >
                    {member}
                  </Button>
                  {
                    editMode && (
                      <IconButton
                        color={selectedMembers.indexOf(member) >= 0 ? "secondary" : "primary"}
                        onClick={() => removeMember(member)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                </ButtonGroup>
              ))
            }
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10, fontSize: 18, fontWeight: 700 }}>
              <Typography>선택한 멤버</Typography>
              <Button
                variant="contained"
                style={{ marginLeft: 10 }}
                onClick={() => setSelectedMembers([])}
              >
                명단 초기화
              </Button>
            </div>
            <Divider style={{ margin: 10, marginLeft: 5, marginRight: 5 }} />
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
                <Divider style={{ margin: 10, marginLeft: 5, marginRight: 5 }} />
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
