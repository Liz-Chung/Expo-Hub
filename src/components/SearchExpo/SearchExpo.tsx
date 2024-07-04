import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { expoList} from '../../expos/recoil/items';
import useModal from '../../hooks/useModal';
import SearchModal from 'modals/SearchModal';
import styles from './SearchExpo.module.css';

interface SearchToggleType {
  searchToggle: boolean;
  setSearchToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchProduct(props: SearchToggleType) {
  const [input, setInput] = useState('');
  const itemsLoadable = useRecoilValueLoadable(expoList);
  let items = 'hasValue' === itemsLoadable.state ? itemsLoadable.contents : [];
  const navigate = useNavigate();

  const searched = items.filter((item) =>
    item.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()),
  );

  const { isOpen, toggle } = useModal();

  useEffect(() => {
    isOpen ? props.setSearchToggle(true) : props.setSearchToggle(false);
  }, [isOpen]);

  return (
    <>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder="Search"
        className={styles.inputText}
        onFocus={toggle}
      />
      <SearchModal isOpen={isOpen} toggle={toggle}>
        <ul className={styles.searchedContainer}>
          {input.length > 0 &&
            searched.map((item) => (
              <li
                key={item.exhibition_id}
                onClick={() => {
                  setInput('');
                  navigate(`/expo/${item.exhibition_id}`);
                }}
                className={styles.searchList}
              >
                <span className={styles.searchListText}>{item.name}</span>
              </li>
            ))}
        </ul>
      </SearchModal>
    </>
  );
}
