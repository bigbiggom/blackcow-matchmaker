import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Checkbox, CircularProgress, Container, CssBaseline, Divider, FormControlLabel, IconButton, Paper, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from '@emotion/styled';

const API_KEY = 'RGAPI-6db99f72-ba41-4999-8817-9ff2de7f820f';
const URL_SUMMONER_INFO = (summonerName) => `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`;
const URL_LEAGUE_INFO = (summonerId) => `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`;

const Rank = ({member}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(URL_SUMMONER_INFO(member))
      .then(res => res.json())
      .then(json => {
        return fetch(URL_LEAGUE_INFO(json.id));
      })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json.length > 0) {
          setData(`${json[0].tier} ${json[0].rank}`);
        }
      })
      .catch(() => {
        setData('UNKNOWN');
      });
  }, []);
  
  if (data !== null) {
    return <div>{data}</div>;
  } else {
    return <CircularProgress />;
  }
};

const DEFAULT_MEMBERS = [
  'Erethism',
  'Plutonia',
  '간지마왕',
  '슈뢰더',
  'Chloe G Moretz',
  'Hisoooop',
  '간다100원',
  '달부달부',
  '달빛부엉이',
  '딕킨슨',
  '리즈웰',
  '사과맛초보자',
  '쌍둥이늑대자리',
  '치킨보살',
  '콰즈랄',
  '키쮸릅쮸릅',
  '피의 욕망',
  '큰곰아저씨',
];

const RootPaper = styled(Paper)`
  margin-top: 10px;
  padding-bottom: 20px;
`;

const TextCenterDiv = styled('div')`
  text-align: center;
`

function App() {
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [teamRedMembers, setTeamRedMembers] = useState([]);
  const [teamBlueMembers, setTeamBlueMembers] = useState([]);
  const [teamRedBoss, setTeamRedBoss] = useState(null);
  const [teamBlueBoss, setTeamBlueBoss] = useState(null);
  
  const [editMode, setEditMode] = useState(false);
  const [bossMode, setBossMode] = useState(false);

  const onClickMember = (member) => {
    const limit = bossMode ? 8 : 10
    if (selectedMembers.length >= limit) { return; }

    if (bossMode) {
      if (teamRedBoss === null) {
        setTeamRedBoss(member);
      } else if (teamBlueBoss === null) {
        setTeamBlueBoss(member);
      } else if (selectedMembers.indexOf(member) < 0) {
        const newMembers = JSON.parse(JSON.stringify(selectedMembers));
        newMembers.push(member);
        setSelectedMembers(newMembers);
      }
    } else if (selectedMembers.indexOf(member) < 0) {
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

    setTeamRedMembers([]);
    setTeamBlueMembers([]);
  }

  const makeMatch = () => {
    const sortedMembers = selectedMembers
      .map((member) => [member, parseInt(Math.random() * 100)])
      .sort((a, b) => a[1] - b[1]);
    setTeamRedMembers(sortedMembers.slice(0, bossMode ? 4 : 5).map(x => x[0]));
    setTeamBlueMembers(sortedMembers.slice(bossMode ? 4 : 5).map(x => x[0]));
  }

  const addNewMember = (member) => {
    const newMembers = JSON.parse(JSON.stringify(members));
    newMembers.push(member);
    setMembers(newMembers);
    setMemberInput('');
    localStorage.setItem('members', JSON.stringify(newMembers));
  }

  const removeMember = (member) => {
    const selectedIndex = selectedMembers.indexOf(member);
    if (selectedIndex >= 0) {
      const newSelectedMembers = JSON.parse(JSON.stringify(selectedMembers));
      newSelectedMembers.splice(selectedIndex, 1);
      setSelectedMembers(newSelectedMembers);
  
      setTeamRedMembers([]);
      setTeamBlueMembers([]);
    }

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
        <RootPaper elevation={3}>
          <TextCenterDiv>
            <div style={{ paddingTop: 10 }}>
              <img src="/images/logo.jpg" alt="로고 이미지" />
            </div>
            <Typography variant="h2">흑우단 매치메이커</Typography>
          </TextCenterDiv>
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
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            * 롤 ID로 입력해주세요.
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10, fontSize: 18, fontWeight: 700 }}>
              <Typography>설정</Typography>
            </div>
            <Divider style={{ margin: 10, marginLeft: 5, marginRight: 5 }} />
            <div style={{ marginLeft: 5, marginRight: 5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={bossMode}
                    onChange={(e) => setBossMode(e.target.checked)}
                  />
                }
                label="팀장 설정"
              />
            </div>
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
          {
            bossMode && (
              <>
                <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10, fontSize: 18, fontWeight: 700 }}>
                    <Typography>선택한 팀장</Typography>
                  </div>
                  <Divider style={{ margin: 10, marginLeft: 5, marginRight: 5 }} />
                  {
                    teamRedBoss !== null && (
                      <Button
                        variant="outlined"
                        style={{ margin: 5 }}
                        onClick={() => setTeamRedBoss(null)}
                      >
                        {teamRedBoss}
                      </Button>
                    )
                  }
                  {
                    teamBlueBoss !== null && (
                      <Button
                        variant="outlined"
                        style={{ margin: 5 }}
                        onClick={() => setTeamBlueBoss(null)}
                      >
                        {teamBlueBoss}
                      </Button>
                    )
                  }
                </div>
              </>
            )
          }
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10, fontSize: 18, fontWeight: 700 }}>
              <Typography>선택한 멤버</Typography>
              <Button
                variant="contained"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setSelectedMembers([]);
                  setTeamRedMembers([]);
                  setTeamBlueMembers([]);
                }}
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
            bossMode && selectedMembers.length === 8 && (
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
                    {
                      bossMode ? (
                        <div style={{ color: '#ff0000', fontSize: 22 }}>
                          team
                          <Button
                            variant="outlined"
                            style={{ margin: 5 }}
                          >
                            {teamRedBoss}
                          </Button>
                        </div>
                      ) : (
                        <div style={{ color: '#ff0000', fontSize: 22 }}>team 1</div>
                      )
                    }
                    {
                      bossMode && (
                        <div>{teamRedBoss}</div>
                      )
                    }
                    {teamRedMembers.map((member) => (<div>{member}</div>))}
                  </div>
                  <div style={{ display: 'flex', margin: 20, alignItems: 'center', justifyContent: 'center' }}>VS</div>
                  <div style={{ flexGrow: 1 }}>
                    {
                      bossMode ? (
                        <div style={{ color: '#0000ff', fontSize: 22 }}>
                          team
                          <Button
                            variant="outlined"
                            style={{ margin: 5 }}
                          >
                            {teamBlueBoss}
                          </Button>
                        </div>
                      ) : (
                        <div style={{ color: '#0000ff', fontSize: 22 }}>team 2</div>
                      )
                    }
                    {
                      bossMode && (
                        <div>{teamBlueBoss}</div>
                      )
                    }
                    {teamBlueMembers.map((member) => (<div>{member}</div>))}
                  </div>
                </div>
              </>
            )
          }
          {
            !bossMode && selectedMembers.length === 10 && (
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
                    {teamRedMembers.map((member) => (
                      <div>
                        <div>{member}</div>
                        {/* <div><Rank member={member} /></div> */}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', margin: 20, alignItems: 'center', justifyContent: 'center' }}>VS</div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ color: '#0000ff', fontSize: 22 }}>team 2</div>
                    {teamBlueMembers.map((member) => (
                      <div>
                        <div>{member}</div>
                        {/* <div><Rank member={member} /></div> */}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          }
        </RootPaper>
      </Container>
    </>
  );
}

export default App;
