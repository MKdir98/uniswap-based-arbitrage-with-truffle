pragma solidity ^0.8.18;

import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IERC20.sol";

contract Arbitrage {
    address public owner = msg.sender;

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        str = string(bstr);
    }

    function transfer(address token, address to, uint256 value) external {
        require(msg.sender == owner, "need owner");
        IERC20(token).transfer(to, value);
    }

    function startArbitrage(
        address router1,
        address router2,
        address token0,
        address token1,
        uint amount0,
        uint gas,
        uint256 deadline
    ) external {
        require(msg.sender == owner, "need owner");
        address[] memory path = new address[](2);
        path[0] = token0;
        path[1] = token1;
        uint initialBalance = IERC20(token0).balanceOf(address(this));
        IERC20(token0).approve(router1, amount0);
        IUniswapV2Router02(router1)
            .swapExactTokensForTokensSupportingFeeOnTransferTokens(
                amount0,
                0,
                path,
                address(this),
                deadline
            );
        uint balance = IERC20(token1).balanceOf(address(this));
        path[1] = token0;
        path[0] = token1;
        IERC20(token1).approve(router2, balance);
        IUniswapV2Router02(router2)
            .swapExactTokensForTokensSupportingFeeOnTransferTokens(
                balance,
                0,
                path,
                address(this),
                block.timestamp
            );
        uint currentBalance = IERC20(token0).balanceOf(address(this));
        require(
            currentBalance - gas > initialBalance,
            string.concat(
                string.concat(
                    uint2str(currentBalance - gas),
                    " :) ",
                    uint2str(initialBalance)
                )
            )
        );
    }
}
